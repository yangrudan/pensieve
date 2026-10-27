"""Local image-pair and loop-rotation checks against saved synthetic camera truth.

No cloud calls. This diagnoses input geometry, not provider output quality or a
full SfM reconstruction. Requires numpy and opencv-python-headless.
"""
import argparse,json,math,hashlib
from pathlib import Path
import cv2
import numpy as np

parser=argparse.ArgumentParser()
parser.add_argument('--case',required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
folder=root/'.local/world-lab'/args.case
poses=json.loads((folder/'camera-poses.json').read_text())
sift=cv2.SIFT_create(nfeatures=5000)
features=[]
cv2.setNumThreads(4)
for i,pose in enumerate(poses):
    img=cv2.imread(str(folder/f'view-{i:02d}.jpg'),cv2.IMREAD_GRAYSCALE)
    keys,desc=sift.detectAndCompute(img,None)
    features.append((np.array([k.pt for k in keys]),desc))
    if i%12==0:print(f'Features {i+1}/{len(poses)}',flush=True)
h,w=poses[0]['height'],poses[0]['width']
f=h/(2*math.tan(math.radians(poses[0]['fov']/2)))
K=np.array([[f,0,w/2],[0,f,h/2],[0,0,1.]])
# Three camera +X/right,+Y/up,-Z/forward -> OpenCV right,down,forward.
flip=np.diag([1.,-1.,-1.])
matcher=cv2.BFMatcher()
rows=[]
loop=np.eye(3)
angle=lambda r:math.degrees(math.acos(np.clip((np.trace(r)-1)/2,-1,1)))
for i in range(len(poses)):
    j=(i+1)%len(poses)
    a,da=features[i];b,db=features[j]
    matches=[x for x,y in matcher.knnMatch(da,db,k=2) if x.distance<.7*y.distance]
    row={'pair':[i,j],'matches':len(matches)}
    if len(matches)<8:
        row['error']='insufficient_matches';rows.append(row);continue
    x=np.float64([a[m.queryIdx] for m in matches]);y=np.float64([b[m.trainIdx] for m in matches])
    E,mask=cv2.findEssentialMat(x,y,K,method=cv2.RANSAC,prob=.999,threshold=1.)
    if E is None:
        row['error']='essential_matrix_failed';rows.append(row);continue
    count,R,t,mask=cv2.recoverPose(E[:3],x,y,K,mask=mask)
    c1=np.array(poses[i]['matrixWorld']).reshape(4,4,order='F')
    c2=np.array(poses[j]['matrixWorld']).reshape(4,4,order='F')
    Rtrue=flip@c2[:3,:3].T@c1[:3,:3]@flip
    ttrue=flip@c2[:3,:3].T@(c1[:3,3]-c2[:3,3]);ttrue/=np.linalg.norm(ttrue)
    error_rot=angle(R@Rtrue.T)
    error_t=math.degrees(math.acos(np.clip(float(t[:,0]@ttrue),-1,1)))
    loop=R@loop
    row.update(inliers=int(count),rotation_error_deg=round(error_rot,4),translation_direction_error_deg=round(error_t,4))
    rows.append(row)
    print(f'Pair {i:02d}-{j:02d}: {count} inliers, rotation {error_rot:.3f} deg, translation {error_t:.3f} deg',flush=True)
valid=[r for r in rows if 'inliers' in r]
worst=[r for r in rows if 'error' in r or r.get('inliers',0)<40 or r.get('rotation_error_deg',999)>2 or r.get('translation_direction_error_deg',999)>15]
summary={'images':len(poses),'checked_pairs':len(rows),'min_inliers':min([r['inliers'] for r in valid],default=0),
         'median_inliers':float(np.median([r['inliers'] for r in valid])) if valid else 0,
         'max_rotation_error_deg':max([r['rotation_error_deg'] for r in valid],default=180),
         'max_translation_direction_error_deg':max([r['translation_direction_error_deg'] for r in valid],default=180),
         'rotation_loop_drift_deg':angle(loop),'failed_pairs':len(worst),'local_geometry_pass':not worst and angle(loop)<=5,
         'scope':'Adjacent-image pose checks and rotation loop closure; NOT full SfM or output acceptance.'}
report={'image_hashes':{f'view-{i:02d}.jpg':hashlib.sha256((folder/f'view-{i:02d}.jpg').read_bytes()).hexdigest() for i in range(len(poses))},'poses_hash':hashlib.sha256((folder/'camera-poses.json').read_bytes()).hexdigest(),'case':args.case,'summary':summary,'failed_pairs':worst,'pairs':rows}
(folder/'geometry-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(summary,ensure_ascii=False,indent=2))
