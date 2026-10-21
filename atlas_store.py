"""Local place labels and photo archives. No provider calls or quota changes."""
import hashlib, time, uuid

DEFAULT_PLACES = [
    {'id':'home','name':'家','color':'#73ddbe'},
    {'id':'work','name':'工作室','color':'#9ca5ff'},
    {'id':'journey','name':'旅途中','color':'#edbc77'},
    {'id':'garden','name':'花园','color':'#e998bb'},
    {'id':'hometown','name':'故乡','color':'#78c9ed'},
]

def snapshot(state):
    return {'places':state.get('places',DEFAULT_PLACES),
            'assignments':state.get('memory_places',{}),
            'archives':list(state.get('archives',{}).values())}

def migrate_archive(state, archive_id, mid):
    if not isinstance(archive_id,str) or archive_id not in state.get('archives',{}): return
    links=state.setdefault('memory_places',{})
    links[mid]=list(dict.fromkeys(links.get(mid,[])+links.pop(archive_id,[])))
    state['archives'].pop(archive_id)

def mutate(state, body, data_dir, prepare_image):
    action=body.get('action')
    places=[dict(p) for p in state.get('places',DEFAULT_PLACES)]
    if action=='place':
        name=body.get('name','').strip();color=body.get('color','')
        if not name or len(name)>24:raise ValueError('地点名称需为 1 至 24 个字')
        if not isinstance(color,str) or len(color)!=7 or color[0]!='#' or any(c not in '0123456789abcdefABCDEF' for c in color[1:]):raise ValueError('请选择有效颜色')
        pid=body.get('id');old=next((p for p in places if p['id']==pid),None)
        if pid and not old:raise ValueError('地点不存在')
        if any(p['name']==name and p['id']!=pid for p in places):raise ValueError('已有同名地点')
        if old:old.update(name=name,color=color)
        else:
            if len(places)>=12:raise ValueError('这片星境最多容纳 12 个地点')
            places.append({'id':uuid.uuid4().hex[:12],'name':name,'color':color})
        state['places']=places
        return snapshot(state)
    if action!='tag':raise ValueError('未知操作')
    ids=body.get('place_ids')
    if not isinstance(ids,list) or len(ids)>12 or any(not isinstance(x,str) or x not in {p['id'] for p in places} for x in ids):raise ValueError('请选择已有地点')
    mid=body.get('memory_id');archives=state.get('archives',{})
    if not isinstance(mid,str) or mid not in {**state['memories'],**archives}:
        if not body.get('image'):raise ValueError('记忆不存在，请重新打开照片')
        data=prepare_image(body['image']);mid=hashlib.sha256(b'archive-v1:'+data).hexdigest()
        name=str(body.get('name','记忆照片'))[:120]
        data_dir.mkdir(mode=0o700,exist_ok=True);(data_dir/f'{mid}.jpg').write_bytes(data)
        state.setdefault('archives',{})[mid]={'id':mid,'name':name,'photo_url':f'/photos/{mid}.jpg','created_at':time.time(),'mode':'photo','status':'photo'}
    state.setdefault('memory_places',{})[mid]=list(dict.fromkeys(ids))
    return {**snapshot(state),'memory_id':mid}
