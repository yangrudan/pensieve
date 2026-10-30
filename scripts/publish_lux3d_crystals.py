"""Publish lightweight copies of the five Lux3D crystal GLBs. Makes no AHOLO calls.

Mesh and accessor bytes are copied unchanged. Only the two embedded 2048 px PNG
textures are re-encoded as smaller JPEGs so a fresh clone stays light and the
hall does not hold ~200 MB of textures on the GPU. Originals in .runtime/ are
only read, never modified.
"""
import hashlib, io, json, struct, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import crystal_lab  # noqa: E402

SOURCE = ROOT / '.runtime'
TARGET = ROOT / crystal_lab.SHARED
TEXTURES = {0: (1024, 90), 1: (512, 88)}  # image index -> (max edge px, JPEG quality)


def read_glb(data):
    magic, version, length = struct.unpack('<4sII', data[:12])
    if magic != b'glTF' or version != 2 or length != len(data):
        raise ValueError('not a GLB 2.0 file')
    offset, doc, blob = 12, None, b''
    while offset < length:
        size, kind = struct.unpack('<I4s', data[offset:offset + 8])
        chunk = data[offset + 8:offset + 8 + size]
        offset += 8 + size
        if kind == b'JSON':
            doc = json.loads(chunk)
        elif kind == b'BIN\x00':
            blob = chunk
    if doc is None:
        raise ValueError('missing JSON chunk')
    return doc, blob


def pad(data, fill):
    return data + fill * (-len(data) % 4)


def write_glb(doc, blob):
    js = pad(json.dumps(doc, separators=(',', ':')).encode(), b' ')
    body = pad(blob, b'\0')
    total = 12 + 8 + len(js) + 8 + len(body)
    return (struct.pack('<4sII', b'glTF', 2, total) + struct.pack('<I4s', len(js), b'JSON') + js
            + struct.pack('<I4s', len(body), b'BIN\x00') + body)


def view_bytes(doc, blob, number):
    view = doc['bufferViews'][number]
    start = view.get('byteOffset', 0)
    return blob[start:start + view['byteLength']]


def geometry_fingerprint(data):
    """Digest of everything except the image payloads and their byte layout."""
    doc, blob = read_glb(data)
    images = {image['bufferView'] for image in doc['images']}
    digest = hashlib.sha256()
    for number in range(len(doc['bufferViews'])):
        if number not in images:
            digest.update(view_bytes(doc, blob, number))
    structure = {key: value for key, value in doc.items() if key not in ('images', 'bufferViews', 'buffers')}
    digest.update(json.dumps(structure, sort_keys=True).encode())
    return digest.hexdigest()


def slim(data):
    doc, blob = read_glb(data)
    if len(doc['images']) != len(TEXTURES) or any(m.get('alphaMode', 'OPAQUE') != 'OPAQUE' for m in doc['materials']):
        raise ValueError('unexpected material layout; refusing to re-encode')
    replaced = {}
    for index, image in enumerate(doc['images']):
        edge, quality = TEXTURES[index]
        with Image.open(io.BytesIO(view_bytes(doc, blob, image['bufferView']))) as picture:
            picture = picture.convert('RGB')  # materials are OPAQUE, so alpha is unused
            picture.thumbnail((edge, edge), Image.LANCZOS)
            out = io.BytesIO()
            picture.save(out, 'JPEG', quality=quality, optimize=True)
        replaced[image['bufferView']] = out.getvalue()
        image['mimeType'] = 'image/jpeg'
    pieces, cursor = [], 0
    for number, view in enumerate(doc['bufferViews']):
        body = replaced.get(number) or view_bytes(doc, blob, number)
        view['byteOffset'], view['byteLength'] = cursor, len(body)
        piece = pad(body, b'\0')
        pieces.append(piece)
        cursor += len(piece)
    doc['buffers'][0]['byteLength'] = cursor
    return write_glb(doc, b''.join(pieces)), doc


def main():
    state = json.loads((SOURCE / 'state.json').read_text())['memories']
    TARGET.mkdir(parents=True, exist_ok=True)
    items = []
    for design in crystal_lab.CATALOG:
        model_id, settings = crystal_lab.prototype(design['case'])
        original = (SOURCE / f'{model_id}.glb').read_bytes()
        lite, doc = slim(original)
        if geometry_fingerprint(original) != geometry_fingerprint(lite):
            raise SystemExit(f'{design["key"]}: geometry changed, aborting')
        (TARGET / f'{model_id}.glb').write_bytes(lite)
        primitive = doc['meshes'][0]['primitives'][0]
        items.append({
            'key': design['key'], 'case': design['case'], 'id': model_id,
            'task_id': str(state.get(model_id, {}).get('task_id') or ''),
            'version': 'G1', 'requested_faces': settings['face_count'],
            'triangles': doc['accessors'][primitive['indices']]['count'] // 3,
            'source_bytes': len(original), 'source_sha256': hashlib.sha256(original).hexdigest(),
            'bytes': len(lite), 'sha256': hashlib.sha256(lite).hexdigest(),
            'geometry_sha256': geometry_fingerprint(lite),
            'textures': 'baseColor 1024 px JPEG q90; metallicRoughness 512 px JPEG q88 (originals: 2048 px PNG)',
        })
        print(f'{design["key"]:9} {len(original) / 1e6:5.2f} MB -> {len(lite) / 1e6:5.2f} MB  {items[-1]["triangles"]} triangles')
    keep = {f'{item["id"]}.glb' for item in items} | {'index.json'}
    for stale in TARGET.glob('*.glb'):
        if stale.name not in keep:
            stale.unlink()
    (TARGET / 'index.json').write_text(json.dumps({'schema_version': 1, 'items': items}, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
