from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import shutil, json

ROOT=Path('/mnt/data/vcx_avatar_fix')
SRC=ROOT/'repaired_v1'
OUT=ROOT/'final_portraits';OUT.mkdir(exist_ok=True)
chars=['minh_an','chu_bay','chi_sen','anh_khoa','ca_bong']
expr=['normal','happy','worried','confused','stressed','angry','thinking','relieved']
# Intentionally substitute incompletely drawn faces in source reference; do not ship half-faces.
fallback={
 'minh_an':{'stressed':'worried','angry':'confused','thinking':'normal'},
 'chu_bay':{'stressed':'worried','angry':'confused','thinking':'confused'},
 'chi_sen':{'angry':'stressed','thinking':'normal'},
 'anh_khoa':{'stressed':'worried','angry':'confused','thinking':'normal'},
 'ca_bong':{'confused':'worried','stressed':'worried','angry':'worried','thinking':'normal'},
}
# For each character fix consistent visual scale based on neutral, not per-expression bbox.
SIZE=(384,448)
base_dimensions={'minh_an':(280,352),'chu_bay':(306,330),'chi_sen':(262,323),'anh_khoa':(292,328),'ca_bong':(310,340)}

def draw_fx(im, mood):
    d=ImageDraw.Draw(im)
    if mood=='stressed':
        # sweat beads near temple, not drawn on face
        for x,y,w,h in [(327,155,17,30),(346,194,11,19)]:
            d.ellipse((x,y,x+w,y+h),fill=(54,161,217,240),outline=(20,100,150,225),width=2)
            d.ellipse((x+3,y+4,x+6,y+10),fill=(228,247,252,230))
    elif mood=='angry':
        # exclamation burst outside hairline
        red=(232,70,43,245)
        for (x1,y1,x2,y2) in [(319,100,344,65),(341,115,377,101),(316,120,350,122)]:
            d.line((x1,y1,x2,y2),fill=red,width=7)
    elif mood=='thinking':
        # question balloon outside head
        x,y=332,96
        d.ellipse((x-24,y-26,x+31,y+30),fill=(255,252,240,250),outline=(114,153,105,240),width=3)
        try:
            font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',45)
        except: font=ImageFont.load_default()
        d.text((x-13,y-26),'?',font=font,fill=(52,107,61,255))
    elif mood=='confused':
        # a small uncertain question only for substituted confused assets
        d.arc((326,92,365,134),180,330,fill=(232,164,54,250),width=5)
        d.ellipse((346,141,353,149),fill=(232,164,54,250))
    return im

report=[]
for char in chars:
  base=Image.open(SRC/f'{char}_normal.png').convert('RGBA')
  for e in expr:
    f_from=fallback.get(char,{}).get(e,e)
    im=Image.open(SRC/f'{char}_{f_from}.png').convert('RGBA')
    # Crop to true alpha, excluding soft antialias remnants
    a=np.array(im.getchannel('A')); yy,xx=np.where(a>28)
    if len(xx): im=im.crop((max(0,int(xx.min())-2),max(0,int(yy.min())-2),min(im.width,int(xx.max())+3),min(im.height,int(yy.max())+3)))
    targetW,targetH=base_dimensions[char]
    scale=min(targetW/im.width,targetH/im.height)
    nw,nh=int(im.width*scale),int(im.height*scale)
    im=im.resize((nw,nh),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',SIZE,(0,0,0,0))
    # bottom anchoring at 410; keep heads ~similar y
    x=(SIZE[0]-nw)//2
    y=410-nh
    canvas.alpha_composite(im,(x,y))
    if f_from!=e: canvas=draw_fx(canvas,e)
    # use RGB under transparent pixel 0 to limit halos in resampling
    canvas.save(OUT/f'{char}_{e}.png',optimize=True)
    report.append({'character':char,'expression':e,'source_expression':f_from,'source_partially_clipped':bool(f_from!=e)})

# build contact sheet with label and large sprite preview for all moods
cellW,cellH=240,310
contact=Image.new('RGB',(len(expr)*cellW,len(chars)*cellH),'#e6f0e4')
d=ImageDraw.Draw(contact)
for j,char in enumerate(chars):
 for i,e in enumerate(expr):
    # a light rounded rect for readability
    x0=i*cellW+6;y0=j*cellH+6
    d.rounded_rectangle((x0,y0,x0+cellW-12,y0+cellH-12),radius=16,fill='#fffaf1',outline='#cad4bd',width=2)
    im=Image.open(OUT/f'{char}_{e}.png').convert('RGBA')
    im.thumbnail((cellW-20,cellH-48),Image.Resampling.LANCZOS)
    x=i*cellW+(cellW-im.width)//2;y=j*cellH+8+(cellH-50-im.height)
    contact.paste(im,(x,y),im)
    mark='*' if fallback.get(char,{}).get(e) else ''
    d.text((i*cellW+13,j*cellH+cellH-36),f'{char} · {e}{mark}',fill='#22392c')
contact.save(ROOT/'avatar_sheet_fixed.png')
(ROOT/'asset_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print('final',len(list(OUT.glob('*.png'))))
