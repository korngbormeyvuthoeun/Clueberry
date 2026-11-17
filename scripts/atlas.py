"""Measure transparent sprite bounds; leave the generated source images intact."""
import json
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parents[1] / 'public' / 'assets'
result = {}
for name in ('cast', 'walk'):
    im = Image.open(root / f'{name}.png').convert('RGBA')
    alpha = im.getchannel('A')
    frames = []
    for row in range(4):
        for col in range(4):
            x0,y0,x1,y1=round(col*im.width/4),round(row*im.height/4),round((col+1)*im.width/4),round((row+1)*im.height/4)
            box=alpha.crop((x0,y0,x1,y1)).point(lambda p:255 if p>100 else 0).getbbox()
            if box is None: raise ValueError(f'Missing frame {name} {row} {col}')
            l,t,r,b=box
            frames.append(dict(x=x0+l,y=y0+t,w=r-l,h=b-t))
    result[name]=frames
(root/'frames.json').write_text(json.dumps(result,indent=2))
print('Measured 32 sprite frames without modifying source art.')
