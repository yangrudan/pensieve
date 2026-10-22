"""Quota/idempotency tests. No network calls to AHOLO."""
import base64, io, json, tempfile, threading, unittest, urllib.request, urllib.error
from pathlib import Path
from unittest.mock import patch, Mock
from PIL import Image
import server

class GenerationGuardTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.old=(server.DATA,server.STATE,server.KEY,server.PORT)
        server.DATA=Path(self.temp.name);server.STATE={'attempts':0,'memories':{}};server.KEY='test-only';server.ACTIVE.clear()
        self.start=patch.object(server,'start').start()
        self.http=server.ThreadingHTTPServer(('127.0.0.1',0),server.Handler);server.PORT=self.http.server_port
        threading.Thread(target=self.http.serve_forever,daemon=True).start()
        self.root=f'http://127.0.0.1:{server.PORT}'
    def tearDown(self):
        self.http.shutdown();self.http.server_close();patch.stopall()
        server.DATA,server.STATE,server.KEY,server.PORT=self.old;server.ACTIVE.clear();self.temp.cleanup()
    def post(self,color=0,token=True,mode="lux3d",**extra):
        im=Image.new('RGB',(16,16),(color*20%256,color*7%256,0));out=io.BytesIO();im.save(out,format='PNG')
        body=json.dumps({'image':base64.b64encode(out.getvalue()).decode(),'name':'test','mode':mode,**extra}).encode()
        headers={'Content-Type':'application/json'}
        if token:headers['X-Pensieve-Token']=server.TOKEN
        req=urllib.request.Request(self.root+'/api/memories',data=body,headers=headers)
        try:
            with urllib.request.urlopen(req) as r:return r.status,json.load(r)
        except urllib.error.HTTPError as e:return e.code,json.load(e)
    def test_duplicate_reuses_job_and_survives_reload(self):
        status,a=self.post();self.assertEqual(status,202)
        server.STATE=json.loads((server.DATA/'state.json').read_text())
        status,b=self.post();self.assertEqual(status,200);self.assertEqual(a['id'],b['id'])
        self.assertEqual(server.STATE['attempts'],1);self.start.assert_called_once()
    def test_budget_never_exceeds_authorized_limit(self):
        for i in range(server.LIMIT):self.assertEqual(self.post(i)[0],202)
        self.assertEqual(self.post(server.LIMIT)[0],429);self.assertEqual(server.STATE['attempts'],server.LIMIT);self.assertEqual(self.start.call_count,server.LIMIT)
    def test_concurrent_duplicates_reserve_once(self):
        results=[]
        threads=[threading.Thread(target=lambda:results.append(self.post())) for _ in range(4)]
        for t in threads:t.start()
        for t in threads:t.join()
        self.assertEqual(sorted(x[0] for x in results),[200,200,200,202]);self.assertEqual(server.STATE['attempts'],1)
    def test_request_without_token_cannot_spend(self):
        self.assertEqual(self.post(token=False)[0],403);self.assertEqual(server.STATE['attempts'],0)
    def test_active_job_blocks_new_photo(self):
        server.ACTIVE.add('busy');self.assertEqual(self.post()[0],409);self.assertEqual(server.STATE['attempts'],0)
    def test_missing_key_cannot_spend(self):
        server.KEY='';self.assertEqual(self.post()[0],503);self.assertEqual(server.STATE['attempts'],0)
    def test_world_and_lux3d_share_budget_but_not_cache(self):
        status,a=self.post(mode='lux3d');self.assertEqual(status,202)
        status,b=self.post(mode='world');self.assertEqual(status,202)
        self.assertNotEqual(a['id'],b['id']);self.assertEqual(b['mode'],'world')
        status,c=self.post(mode='world');self.assertEqual(status,200)
        self.assertEqual(c['id'],b['id']);self.assertEqual(server.STATE['attempts'],2)
        server.STATE['attempts']=server.LIMIT
        self.assertEqual(self.post(1,mode='world')[0],429)
    def test_unknown_generation_mode_cannot_spend(self):
        self.assertEqual(self.post(mode='anything')[0],400);self.assertEqual(server.STATE['attempts'],0)
    def test_fourview_shares_budget_and_deduplicates(self):
        a=self.post(mode='fourview');b=self.post(mode='fourview')
        self.assertEqual((a[0],b[0]),(202,200));self.assertEqual(a[1]['id'],b[1]['id'])
        self.assertEqual(server.STATE['attempts'],1)
        server.STATE['attempts']=server.LIMIT
        self.assertEqual(self.post(1,mode='fourview')[0],429)
    def test_multiview_requires_complete_local_views_before_spending(self):
        self.assertEqual(self.post(mode='multiview',view_source_id='missing')[0],400)
        _,source=self.post(mode='fourview');mid=source['id']
        self.assertEqual(self.post(mode='multiview',view_source_id=mid)[0],400)
        source=server.STATE['memories'][mid];source.update(status='ready',views=['view']*4)
        self.assertEqual(self.post(mode='multiview',view_source_id=mid)[0],400)
        self.assertEqual(server.STATE['attempts'],1)
        (server.DATA/mid).mkdir()
        for i in range(4):(server.DATA/mid/f'view-{i}.jpg').write_bytes(b'cached')
        status,result=self.post(mode='multiview',view_source_id=mid)
        self.assertEqual(status,202);self.assertEqual(result['face_count'],200000)
        self.assertEqual(self.post(mode='multiview',view_source_id=mid)[0],200)
        self.assertEqual(server.STATE['attempts'],2)
        server.STATE['attempts']=server.LIMIT
        self.assertEqual(self.post(1,mode='multiview',view_source_id=mid)[0],429)
    def test_host_validation(self):
        req=urllib.request.Request(self.root+'/api/session',headers={'Host':'untrusted.example'})
        with self.assertRaises(urllib.error.HTTPError) as c:urllib.request.urlopen(req)
        self.assertEqual(c.exception.code,403)


class AtlasTests(unittest.TestCase):
    setUp=GenerationGuardTests.setUp
    tearDown=GenerationGuardTests.tearDown
    post=GenerationGuardTests.post
    def atlas_post(self,body,token=True,path='/api/atlas'):
        headers={'Content-Type':'application/json'}
        if token:headers['X-Pensieve-Token']=server.TOKEN
        req=urllib.request.Request(self.root+path,data=json.dumps(body).encode(),headers=headers)
        try:
            with urllib.request.urlopen(req) as r:return r.status,json.load(r)
        except urllib.error.HTTPError as e:return e.code,json.load(e)
    def test_places_and_tags_persist_without_key_or_quota(self):
        _,m=self.post();before=server.STATE['attempts'];server.KEY=''
        status,a=self.atlas_post({'action':'place','name':'海边','color':'#abcdef'})
        self.assertEqual(status,200);pid=a['places'][-1]['id']
        status,a=self.atlas_post({'action':'tag','memory_id':m['id'],'place_ids':['home',pid]})
        self.assertEqual(status,200)
        server.STATE=json.loads((server.DATA/'state.json').read_text())
        self.assertEqual(server.STATE['memory_places'][m['id']],['home',pid])
        self.assertEqual(server.STATE['attempts'],before)
        self.assertEqual(self.atlas_post({'action':'place','id':pid,'name':'海边的家','color':'#112233'})[0],200)
        self.assertEqual(self.atlas_post({'action':'tag','memory_id':m['id'],'place_ids':[]})[0],200)
    def test_invalid_or_forged_tags_do_not_change_state(self):
        for body in [{'action':'tag','memory_id':'missing','place_ids':['home']},{'action':'place','name':'地点','color':'red'},{'action':'tag','memory_id':'missing','place_ids':['invented']},{'action':'place','name':'家','color':'#112233'}]:
            self.assertEqual(self.atlas_post(body)[0],400)
        self.assertEqual(self.atlas_post({'action':'place','name':'秘密','color':'#112233'},token=False)[0],403)
        self.assertEqual(server.STATE,{'attempts':0,'memories':{}})
    def test_local_photo_archive_deduplicates_and_migrates_to_generated_memory(self):
        out=io.BytesIO();Image.new('RGB',(30,20),'green').save(out,format='PNG')
        body={'action':'tag','name':'local','image':base64.b64encode(out.getvalue()).decode(),'place_ids':['home']}
        status,a=self.atlas_post(body);self.assertEqual(status,200);archive=a['memory_id']
        self.assertTrue((server.DATA/f'{archive}.jpg').exists());self.assertEqual(server.STATE['attempts'],0);self.start.assert_not_called()
        self.assertEqual(self.atlas_post(body)[1]['memory_id'],archive);self.assertEqual(len(server.STATE['archives']),1)
        status,m=self.post(archive_id=archive);self.assertEqual(status,202)
        self.assertEqual(server.STATE['memory_places'][m['id']],['home']);self.assertNotIn(archive,server.STATE['archives'])

class WorldExperimentTests(unittest.TestCase):
    setUp=GenerationGuardTests.setUp
    tearDown=GenerationGuardTests.tearDown
    atlas_post=AtlasTests.atlas_post
    def make_case(self,name='test-case',count=24,method='reconstruction'):
        patch.object(server,'ROOT',server.DATA).start()
        folder=server.DATA/'.local/world-lab'/name;folder.mkdir(parents=True,exist_ok=True)
        for i in range(count):Image.new('RGB',(16,16),(i*9%256,i*7%256,10)).save(folder/f'{i}.jpg')
        (folder/'manifest.json').write_text(json.dumps({'name':name,'method':method,'images':[f'{i}.jpg' for i in range(count)]}))
        return name
    def submit(self,case,token=True):return self.atlas_post({'case':case},token=token,path='/api/experiments')
    def test_reconstruction_reserves_once_and_stays_out_of_personal_memories(self):
        case=self.make_case();status,a=self.submit(case);self.assertEqual(status,202)
        status,b=self.submit(case);self.assertEqual(status,200);self.assertEqual(a['id'],b['id'])
        self.assertEqual(a['input_count'],24);self.assertEqual(server.STATE['attempts'],1)
        self.start.assert_called_once()
        with urllib.request.urlopen(self.root+'/lab-inputs/test-case/0.jpg') as r:self.assertEqual(r.headers['Content-Type'],'image/jpeg')
        with self.assertRaises(urllib.error.HTTPError) as err:urllib.request.urlopen(self.root+'/lab-inputs/test-case/manifest.json')
        self.assertEqual(err.exception.code,404)
        with urllib.request.urlopen(self.root+'/api/memories') as r:self.assertEqual(json.load(r)['items'],[])
        with urllib.request.urlopen(self.root+'/api/experiments') as r:self.assertEqual(len(json.load(r)['items']),1)
    def test_invalid_sets_and_forged_requests_do_not_reserve(self):
        case=self.make_case(count=19);self.assertEqual(self.submit(case)[0],400)
        self.assertEqual(self.submit('../escape')[0],400)
        case=self.make_case(name='valid');self.assertEqual(self.submit(case,token=False)[0],403)
        (server.DATA/'.local/world-lab/valid/1.jpg').write_bytes((server.DATA/'.local/world-lab/valid/0.jpg').read_bytes())
        self.assertEqual(self.submit(case)[0],400)
        self.assertEqual(server.STATE['attempts'],0);self.start.assert_not_called()
    def test_experiment_uses_shared_authorized_limit_and_concurrency_guard(self):
        case=self.make_case();server.STATE['attempts']=server.LIMIT
        self.assertEqual(self.submit(case)[0],429);self.assertEqual(server.STATE['attempts'],server.LIMIT)
        server.STATE['attempts']=0;server.ACTIVE.add('personal-job')
        self.assertEqual(self.submit(case)[0],409);self.assertEqual(server.STATE['attempts'],0)

class CrystalExperimentTests(unittest.TestCase):
    setUp=GenerationGuardTests.setUp
    tearDown=GenerationGuardTests.tearDown
    def submit(self,case='emerald-quartz-lux-v1',token=True):
        headers={'Content-Type':'application/json'}
        if token:headers['X-Pensieve-Token']=server.TOKEN
        request=urllib.request.Request(self.root+'/api/crystal-experiments',data=json.dumps({'case':case}).encode(),headers=headers)
        try:
            with urllib.request.urlopen(request) as response:return response.status,json.load(response)
        except urllib.error.HTTPError as exc:return exc.code,json.load(exc)
    def test_first_crystal_reserves_once_and_deduplicates(self):
        a=self.submit();b=self.submit()
        self.assertEqual((a[0],b[0]),(202,200));self.assertEqual(a[1]['id'],b[1]['id'])
        self.assertEqual(server.STATE['attempts'],1);self.start.assert_called_once()
        model=server.STATE['memories'][a[1]['id']]
        self.assertEqual(model['generation_method'],'text_to_3d');self.assertTrue(model['experimental'])
    def test_other_crystals_are_held_for_quality_review(self):
        self.assertEqual(self.submit('purple-cluster')[0],400)
        self.assertEqual(server.STATE['attempts'],0);self.start.assert_not_called()
    def test_authentication_budget_and_busy_guard(self):
        self.assertEqual(self.submit(token=False)[0],403)
        server.STATE['attempts']=server.LIMIT
        self.assertEqual(self.submit()[0],429)
        server.STATE['attempts']=0;server.ACTIVE.add('busy')
        self.assertEqual(self.submit()[0],409);self.assertEqual(server.STATE['attempts'],0)
    def test_worker_uses_text_generation_once_and_resume_only_queries(self):
        _,entry=self.submit();mid=entry['id'];asset,lux=Mock(),Mock()
        lux.text_to_3d.create.return_value=12345
        lux.tasks.retrieve.return_value={'status':3,'outputs':[{'content':'https://example.invalid/crystal.glb'}]}
        with patch.object(server,'clients',return_value=(asset,lux)),patch.object(server,'download_glb'):
            server.work(mid,True)
            self.assertEqual(server.STATE['memories'][mid]['status'],'ready')
            server.work(mid,False)
        lux.text_to_3d.create.assert_called_once();lux.img_to_3d.create.assert_not_called();asset.upload_file.assert_not_called()
        self.assertEqual(server.STATE['attempts'],1)
    def test_lost_text_create_receipt_is_not_retried(self):
        _,entry=self.submit();mid=entry['id'];asset,lux=Mock(),Mock();lux.text_to_3d.create.side_effect=RuntimeError('connection lost')
        with patch.object(server,'clients',return_value=(asset,lux)):
            server.work(mid,True)
        self.assertEqual(server.STATE['memories'][mid]['status'],'uncertain')
        self.assertEqual(self.submit()[0],200);self.assertEqual(server.STATE['attempts'],1)
        lux.text_to_3d.create.assert_called_once()

if __name__=='__main__':unittest.main()
