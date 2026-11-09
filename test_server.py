"""Quota/idempotency tests. No network calls to AHOLO."""
import base64, hashlib, io, json, tempfile, threading, unittest, urllib.request, urllib.error
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
    def delete(self,mid,token=True,**headers):
        if token: headers['X-Pensieve-Token']=server.TOKEN
        req=urllib.request.Request(self.root+'/api/memories/'+mid,method='DELETE',headers=headers)
        try:
            with urllib.request.urlopen(req) as r:return r.status,json.load(r)
        except urllib.error.HTTPError as e:return e.code,json.load(e)
    def test_delete_removes_saved_memory_files_and_tags_without_refunding(self):
        _,m=self.post();mid=m['id']
        server.STATE['memory_places']={mid:['home']}
        (server.DATA/f'{mid}.glb').write_bytes(b'model')
        folder=server.DATA/mid;folder.mkdir();(folder/'panorama.jpg').write_bytes(b'photo')
        self.assertEqual(self.delete(mid)[0],200)
        persisted=json.loads((server.DATA/'state.json').read_text())
        self.assertNotIn(mid,persisted['memories']);self.assertNotIn(mid,persisted['memory_places'])
        self.assertEqual(persisted['attempts'],1)
        self.assertFalse((server.DATA/f'{mid}.jpg').exists())
        self.assertFalse((server.DATA/f'{mid}.glb').exists());self.assertFalse(folder.exists())
        self.assertEqual(self.delete(mid)[0],404)
    def test_delete_guards_active_tasks_token_origin_and_paths(self):
        _,m=self.post();mid=m['id']
        self.assertEqual(self.delete(mid,token=False)[0],403)
        self.assertEqual(self.delete(mid,Origin='https://untrusted.example')[0],403)
        self.assertEqual(self.delete('../state.json')[0],404)
        server.ACTIVE.add(mid)
        self.assertEqual(self.delete(mid)[0],409);self.assertIn(mid,server.STATE['memories'])
    def test_delete_archive_and_preserve_other_memories(self):
        mid='a'*64;server.STATE['archives']={mid:{'id':mid}}
        (server.DATA/f'{mid}.jpg').write_bytes(b'photo')
        _,m=self.post()
        self.assertEqual(self.delete(mid)[0],200)
        self.assertNotIn(mid,server.STATE['archives']);self.assertIn(m['id'],server.STATE['memories'])
    def test_delete_keeps_referenced_source(self):
        _,m=self.post(mode='fourview');mid=m['id']
        server.STATE['memories']['dependent']={'view_source_id':mid}
        self.assertEqual(self.delete(mid)[0],409)
        self.assertTrue((server.DATA/f'{mid}.jpg').exists())

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

    def test_geometry_gate_blocks_missing_failed_and_stale_inputs_before_reservation(self):
        case=self.make_case(name='geometry-gated')
        folder=server.DATA/'.local/world-lab'/case
        manifest=json.loads((folder/'manifest.json').read_text())
        manifest['require_geometry_check']=True
        (folder/'manifest.json').write_text(json.dumps(manifest))
        self.assertEqual(self.submit(case)[0],400)
        (folder/'camera-poses.json').write_text('[]')
        summary={'local_geometry_pass':False,'failed_pairs':1,'checked_pairs':24,
                 'min_inliers':100,'max_rotation_error_deg':.5,
                 'max_translation_direction_error_deg':2,'rotation_loop_drift_deg':1}
        report={'summary':summary,'image_hashes':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.glob('*.jpg')},
                'poses_hash':hashlib.sha256((folder/'camera-poses.json').read_bytes()).hexdigest()}
        (folder/'geometry-check.json').write_text(json.dumps(report))
        self.assertEqual(self.submit(case)[0],400)
        summary.update(local_geometry_pass=True,failed_pairs=0)
        (folder/'geometry-check.json').write_text(json.dumps(report))
        original=(folder/'0.jpg').read_bytes()
        Image.new('RGB',(16,16),(100,100,100)).save(folder/'0.jpg')
        self.assertEqual(self.submit(case)[0],400)
        self.assertEqual(server.STATE['attempts'],0);self.start.assert_not_called()
        (folder/'0.jpg').write_bytes(original)
        self.assertEqual(self.submit(case)[0],202)
        self.assertEqual(server.STATE['attempts'],1);self.start.assert_called_once()

class SharedWorldTests(unittest.TestCase):
    setUp=GenerationGuardTests.setUp
    tearDown=GenerationGuardTests.tearDown
    atlas_post=AtlasTests.atlas_post

    def bundle(self):
        patch.object(server,'ROOT',server.DATA).start()
        folder=server.DATA/'shared/world-lab/inputs/shared-test';folder.mkdir(parents=True)
        Image.new('RGB',(16,16),(20,30,40)).save(folder/'reference.jpg')
        (folder/'manifest.json').write_text(json.dumps({'method':'generation','images':['reference.jpg']}))
        _,_,mid=server.world_lab.load_case(server.ROOT,'shared-test')
        item={'id':mid,'experimental':True,'case':'shared-test','mode':'world','status':'ready','name':'Shared hall','world_assets':{'splat_url':f'/world-assets/{mid}/space.spz','format':'spz'}}
        (server.DATA/'shared/world-lab/index.json').write_text(json.dumps({'items':[item]}))
        assets=server.DATA/'shared/world-lab/assets'/mid;assets.mkdir(parents=True)
        (assets/'space.spz').write_bytes(b'shared-splat')
        (assets/'provider-result.json').write_text('private')
        server.STATE.update(attempts=9,memories={'personal':{'id':'personal','name':'Mac memory','status':'ready'}})
        server.STATE['atlas']={'places':[{'id':'mac-place'}]};server.save()
        return item

    def get(self,path):
        with urllib.request.urlopen(self.root+path) as response:return response.read()

    def test_shared_read_and_duplicate_submission_preserve_personal_state_and_budget(self):
        item=self.bundle();before=(server.DATA/'state.json').read_bytes()
        self.assertEqual(json.loads(self.get('/api/experiments'))['items'],[item])
        self.assertEqual(json.loads(self.get('/api/memories'))['items'][0]['name'],'Mac memory')
        self.assertEqual(self.get(item['world_assets']['splat_url']),b'shared-splat')
        self.assertTrue(self.get('/lab-inputs/shared-test/reference.jpg').startswith(b'\xff\xd8'))
        code,existing=self.atlas_post({'case':'shared-test'},path='/api/experiments')
        self.assertEqual(code,200);self.assertEqual(existing['id'],item['id'])
        self.assertEqual((server.DATA/'state.json').read_bytes(),before)
        self.assertEqual(server.STATE['attempts'],9);self.start.assert_not_called()

    def test_local_record_and_asset_take_precedence(self):
        item=self.bundle();local={**item,'name':'Local hall'};server.STATE['memories'][item['id']]=local
        self.assertEqual(json.loads(self.get('/api/experiments'))['items'],[local])
        folder=server.DATA/item['id'];folder.mkdir();(folder/'space.spz').write_bytes(b'local-splat')
        self.assertEqual(self.get(item['world_assets']['splat_url']),b'local-splat')

    def test_unlisted_assets_and_missing_files_return_404(self):
        item=self.bundle();mid=item['id']
        for name in ['provider-result.json','panorama.jpg']:
            with self.assertRaises(urllib.error.HTTPError) as error:self.get(f'/world-assets/{mid}/{name}')
            self.assertEqual(error.exception.code,404)
        with self.assertRaises(urllib.error.HTTPError) as error:self.get('/lab-inputs/shared-test/manifest.json')
        self.assertEqual(error.exception.code,404)

class CrystalExperimentTests(unittest.TestCase):
    def setUp(self):
        GenerationGuardTests.setUp(self)
        # These tests cover the generation path, so start from a clone with no published crystals.
        patch.object(server.crystal_lab,'SHARED','no-published-crystals').start()
    tearDown=GenerationGuardTests.tearDown
    def submit(self,case='emerald-quartz-lux-v1',token=True,**extra):
        headers={'Content-Type':'application/json'}
        if token:headers['X-Pensieve-Token']=server.TOKEN
        request=urllib.request.Request(self.root+'/api/crystal-experiments',data=json.dumps({'case':case,**extra}).encode(),headers=headers)
        try:
            with urllib.request.urlopen(request) as response:return response.status,json.load(response)
        except urllib.error.HTTPError as exc:return exc.code,json.load(exc)
    def test_first_crystal_reserves_once_and_deduplicates(self):
        a=self.submit();b=self.submit()
        self.assertEqual((a[0],b[0]),(202,200));self.assertEqual(a[1]['id'],b[1]['id'])
        self.assertEqual(server.STATE['attempts'],1);self.start.assert_called_once()
        model=server.STATE['memories'][a[1]['id']]
        self.assertEqual(model['generation_method'],'text_to_3d');self.assertTrue(model['experimental'])
    def test_unknown_crystals_cannot_spend(self):
        self.assertEqual(self.submit('purple-cluster')[0],400)
        self.assertEqual(server.STATE['attempts'],0);self.start.assert_not_called()
    def test_five_fixed_designs_share_budget_and_deduplicate(self):
        ids=[]
        for design in server.crystal_lab.CATALOG:
            status,entry=self.submit(design['case']);self.assertEqual(status,202);ids.append(entry['id'])
            self.assertEqual(entry['face_count'],design['face_count'])
            self.assertEqual(self.submit(design['case'])[0],200)
        self.assertEqual(len(set(ids)),5);self.assertEqual(server.STATE['attempts'],5)
        self.assertEqual(ids[0],'86ee2204fe016c9a2c34c339c148e0f8b334a4409db3e610565254614bef5e9c')
    def test_at_most_two_experimental_jobs(self):
        server.STATE['memories']['a']={'experimental':True};server.ACTIVE.add('a')
        self.assertEqual(self.submit()[0],202)
        server.STATE['memories']['b']={'experimental':True};server.ACTIVE.add('b')
        self.assertEqual(self.submit('amethyst-cluster-lux-v1')[0],409)
        self.assertEqual(server.STATE['attempts'],1)
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
    def test_manual_business_rejection_retry_checks_full_history(self):
        _,entry=self.submit();item=server.STATE['memories'][entry['id']]
        item.update(status='uncertain',created_at=item['created_at']-120)
        asset,lux=Mock(),Mock();lux.tasks.list.return_value={'items':[],'total':0}
        with patch.object(server,'clients',return_value=(asset,lux)):
            self.assertEqual(self.submit(retry_business_rejection=True,observed_error_type='TimeoutError')[0],409)
            self.assertEqual(self.submit(retry_business_rejection=True,observed_error_type='BusinessError')[0],202)
            self.assertEqual(self.submit(retry_business_rejection=True,observed_error_type='BusinessError')[0],409)
        self.assertEqual(server.STATE['attempts'],2);self.assertEqual(item['retry_count'],1)
    def test_unmatched_recent_or_incomplete_history_blocks_retry(self):
        item={'status':'uncertain','created_at':1000}
        verify=server.crystal_lab.verify_rejected_retry
        self.assertFalse(verify(item,{'items':[],'total':1},set(),now=1200))
        self.assertFalse(verify(item,{'items':[{'taskId':42,'created':1010}],'total':1},set(),now=1200))
        self.assertTrue(verify(item,{'items':[{'taskId':42,'created':900}],'total':1},set(),now=1200))

class CacheHeaderTests(unittest.TestCase):
    """Static files must be revalidated; routes with their own caching rules keep them."""
    setUp=GenerationGuardTests.setUp
    tearDown=GenerationGuardTests.tearDown

    def headers(self,path):
        with urllib.request.urlopen(self.root+path) as response:return response.headers

    def test_static_files_revalidate_while_api_and_assets_keep_their_own_rules(self):
        self.assertEqual(self.headers('/atlas/').get_all('Cache-Control'),['no-cache'])
        self.assertEqual(self.headers('/atlas/atlas.css').get_all('Cache-Control'),['no-cache'])
        self.assertEqual(self.headers('/api/session').get_all('Cache-Control'),['no-store'])
        mid,_=server.crystal_lab.prototype('emerald-quartz-lux-v1')
        self.assertEqual(self.headers(f'/crystal-models/{mid}.glb').get_all('Cache-Control'),['private, max-age=3600'])

class PublishedCrystalTests(unittest.TestCase):
    """Lux3D crystals shipped in shared/lux3d-crystals: viewable without a key, never spend."""
    setUp=GenerationGuardTests.setUp
    tearDown=GenerationGuardTests.tearDown
    submit=CrystalExperimentTests.submit
    CASE='emerald-quartz-lux-v1'

    def publish(self,payload=b'published-glb',**override):
        patch.object(server,'ROOT',server.DATA).start()
        mid,_=server.crystal_lab.prototype(self.CASE)
        folder=server.DATA/server.crystal_lab.SHARED;folder.mkdir(parents=True)
        (folder/f'{mid}.glb').write_bytes(payload)
        entry={'case':self.CASE,'id':mid,'task_id':'4276230','sha256':hashlib.sha256(payload).hexdigest(),'bytes':len(payload),**override}
        (folder/'index.json').write_text(json.dumps({'items':[entry]}))
        server.save();return mid,folder

    def get(self,path):
        with urllib.request.urlopen(self.root+path) as response:return response.status,response.read()

    def missing(self,path):
        with self.assertRaises(urllib.error.HTTPError) as error:self.get(path)
        return error.exception.code

    def test_published_crystal_is_listed_ready_without_touching_personal_state(self):
        mid,_=self.publish();before=(server.DATA/'state.json').read_bytes()
        listing=json.loads(self.get('/api/experiments')[1]);item=listing['items'][0]
        self.assertEqual((item['id'],item['status'],item['case']),(mid,'ready',self.CASE))
        self.assertEqual(item['model_url'],f'/models/{mid}.glb');self.assertEqual(listing['attempts'],0)
        self.assertEqual(json.loads(self.get('/api/memories')[1])['items'],[])
        self.assertEqual((server.DATA/'state.json').read_bytes(),before)

    def test_submitting_a_published_design_returns_it_and_spends_nothing(self):
        mid,_=self.publish()
        status,entry=self.submit(self.CASE);self.assertEqual((status,entry['id']),(200,mid))
        self.assertEqual(server.STATE['attempts'],0);self.assertEqual(server.STATE['memories'],{});self.start.assert_not_called()

    def test_hall_and_model_routes_serve_only_verified_published_files(self):
        mid,_=self.publish(b'published-glb')
        self.assertEqual(self.get(f'/crystal-models/{mid}.glb'),(200,b'published-glb'))
        self.assertEqual(self.get(f'/models/{mid}.glb')[1],b'published-glb')
        (server.DATA/f'{mid}.glb').write_bytes(b'local-original')
        self.assertEqual(self.get(f'/models/{mid}.glb')[1],b'local-original')
        self.assertEqual(self.get(f'/crystal-models/{mid}.glb')[1],b'published-glb')
        self.assertEqual(self.missing(f'/photos/{mid}.jpg'),404)
        self.assertEqual(self.missing('/crystal-models/'+'a'*64+'.glb'),404)
        self.assertEqual(self.missing('/crystal-models/index.json'),404)

    def test_tampered_or_unlisted_files_are_not_served_or_listed(self):
        mid,folder=self.publish(b'published-glb')
        (folder/f'{mid}.glb').write_bytes(b'tampered!!!!!')
        self.assertEqual(self.missing(f'/crystal-models/{mid}.glb'),404)
        self.assertEqual(json.loads(self.get('/api/experiments')[1])['items'],[])
        stray=folder/('b'*64+'.glb');stray.write_bytes(b'stray')
        self.assertEqual(self.missing('/crystal-models/'+'b'*64+'.glb'),404)

    def test_index_entries_must_match_the_fixed_catalog(self):
        # Each bad entry is rejected; a bad entry never blocks a genuine submission's budget check.
        for override in ({'id':'c'*64},{'case':'not-a-design'},{'sha256':'zz'},{'bytes':1}):
            with self.subTest(override=override):
                mid,folder=self.publish(**override)
                self.assertEqual(server.crystal_lab.bundled_items(server.ROOT),[])
                self.assertIsNone(server.crystal_lab.bundled_model(server.ROOT,mid))
                self.assertEqual(self.missing(f'/crystal-models/{mid}.glb'),404)
                import shutil;shutil.rmtree(folder)

if __name__=='__main__':unittest.main()
