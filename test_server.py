"""Quota/idempotency tests. No network calls to AHOLO."""
import base64, io, json, tempfile, threading, unittest, urllib.request, urllib.error
from pathlib import Path
from unittest.mock import patch
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
    def post(self,color=0,token=True,mode="lux3d"):
        im=Image.new('RGB',(16,16),(color*20,0,0));out=io.BytesIO();im.save(out,format='PNG')
        body=json.dumps({'image':base64.b64encode(out.getvalue()).decode(),'name':'test','mode':mode}).encode()
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
    def test_budget_never_exceeds_ten(self):
        for i in range(10):self.assertEqual(self.post(i)[0],202)
        self.assertEqual(self.post(10)[0],429);self.assertEqual(server.STATE['attempts'],10);self.assertEqual(self.start.call_count,10)
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
        server.STATE['attempts']=10
        self.assertEqual(self.post(1,mode='world')[0],429)
    def test_unknown_generation_mode_cannot_spend(self):
        self.assertEqual(self.post(mode='anything')[0],400);self.assertEqual(server.STATE['attempts'],0)
    def test_host_validation(self):
        req=urllib.request.Request(self.root+'/api/session',headers={'Host':'untrusted.example'})
        with self.assertRaises(urllib.error.HTTPError) as c:urllib.request.urlopen(req)
        self.assertEqual(c.exception.code,403)

if __name__=='__main__':unittest.main()
