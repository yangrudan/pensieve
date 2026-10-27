"""Read cached splat bounds and approximate colored landmark centers; no generation.

Color groups are aids to camera positioning, never object-count acceptance.
"""
import argparse,json,urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--case',required=True);parser.add_argument('--url',default='http://127.0.0.1:4174');args=parser.parse_args()
base=args.url.rstrip('/')
with urllib.request.urlopen(base+'/api/experiments') as r:record=next(x for x in json.load(r)['items'] if x.get('case')==args.case)
if record['status']!='ready':raise SystemExit('Output is not ready; nothing submitted.')
with sync_playwright() as p:
    b=p.chromium.launch(headless=True,args=['--no-sandbox'])
    page=b.new_page();page.route('**/__splat_inspection__',lambda route:route.fulfill(body='<html></html>',content_type='text/html'));page.goto(base+'/__splat_inspection__')
    stats=page.evaluate('''async asset=>{
      const {SplatLoader}=await import('/vendor/aholo/index.js');const r=await fetch(asset.splat_url);
      const data=await SplatLoader.parseSplatData(asset.format==='spz'?SplatLoader.SplatFileType.SPZ:SplatLoader.SplatFileType.PLY,new Uint8Array(await r.arrayBuffer()),SplatLoader.SplatPackType.Compressed);
      const centers=new Float32Array(data.counts*3);data.fillCenters(centers);const step=Math.max(1,Math.floor(data.counts/50000)),axes=[[],[],[]];
      const median=xs=>{xs.sort((a,b)=>a-b);return xs[Math.floor(xs.length/2)];};
      for(let i=0;i<data.counts;i+=step)for(let a=0;a<3;a++)axes[a].push(centers[i*3+a]);
      const ranges=axes.map(xs=>{xs.sort((a,b)=>a-b);return [.01,.05,.5,.95,.99].map(q=>xs[Math.floor((xs.length-1)*q)]);});
      const floor=ranges[2][1],cx=ranges[0][2],cy=ranges[1][2],radius=Math.min(ranges[0][4]-ranges[0][0],ranges[1][4]-ranges[1][0])*.39;
      const groups={green:[],purple:[],amber:[],pink:[],blue:[]},c={};
      for(let i=0;i<data.counts;i+=step){const x=centers[i*3],y=centers[i*3+1],z=centers[i*3+2];if(z<floor+.5||z>floor+3||Math.hypot(x-cx,y-cy)>radius)continue;data.getColor(i,c);let r=c.r,g=c.g,b=c.b;if(Math.max(r,g,b)>1){r/=255;g/=255;b/=255;}const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;if(d<.12||max<.2||d/max<.3)continue;let hue=max===r?(g-b)/d:max===g?(b-r)/d+2:(r-g)/d+4;hue=(hue*60+360)%360;const kind=hue>=70&&hue<170?'green':hue>=245&&hue<305?'purple':hue>=20&&hue<65?'amber':hue>=305||hue<15?'pink':hue>=170&&hue<245?'blue':null;if(kind)groups[kind].push([x,y,z]);}
      return {count:data.counts,shDegree:data.shDegree,quantiles:ranges,upAxis:asset.up_axis,colorGroups:Object.fromEntries(Object.entries(groups).map(([k,points])=>[k,{samples:points.length,center:points.length?[0,1,2].map(a=>median(points.map(p=>p[a]))):null}]))};
    }''',record['world_assets'])
    b.close()
folder=Path('.local/world-lab')/args.case/'review';folder.mkdir(parents=True,exist_ok=True)
(folder/'splat-inspection.json').write_text(json.dumps(stats,indent=2))
print(json.dumps(stats,indent=2))
