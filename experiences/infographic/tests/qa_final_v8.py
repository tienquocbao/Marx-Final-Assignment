"""Final QA: v8 rail-to-badge clearance, interactions, references, and responsive layout."""
import asyncio,mimetypes,sys,re
from urllib.parse import urlparse,unquote
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text('utf-8').replace('<head>','<head><base href="https://poster.vcx.test/">',1)
async def page_for(browser,w,h):
 page=await browser.new_page(viewport={'width':w,'height':h},accept_downloads=True)
 errors=[];missing=[]
 page.on('pageerror',lambda err:errors.append(str(err)))
 async def serve(route):
  rel=unquote(urlparse(route.request.url).path).lstrip('/')
  file=(ROOT/rel).resolve()
  if not file.is_relative_to(ROOT) or not file.is_file():
   missing.append(rel);await route.fulfill(status=404,body='Missing: '+rel);return
  ct=mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
  if file.suffix=='.ogg':ct='audio/ogg'
  await route.fulfill(status=200,body=file.read_bytes(),content_type=ct)
 await page.route('**/*',serve)
 await page.set_content(HTML,wait_until='load',timeout=25000)
 return page,errors,missing
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h,label in [(1920,1080,'desktop'),(1280,720,'projector'),(390,844,'mobile')]:
   page,errors,missing=await page_for(browser,w,h)
   await page.wait_for_timeout(180)
   d=await page.evaluate('''() => {
    const paper=document.querySelector('#poster'),pr=paper.getBoundingClientRect();
    const marker=[...paper.querySelectorAll('.zone-number')].map(n=>{const r=n.getBoundingClientRect();return {x:r.left-pr.left,right:r.right-pr.left,y:r.top-pr.top+r.height/2}});
    const path=document.querySelector('#routeBase').getAttribute('d');
    const x=Number(path.match(/^M ([\\d.]+)/)?.[1]||0);
    const branches=[...document.querySelectorAll('.route-branch')].map(n=>({d:n.getAttribute('d'),end:Number(n.getAttribute('d').match(/ L ([\\d.]+)/)[1])}));
    return {width:paper.offsetWidth,height:paper.offsetHeight,scrollWidth:document.documentElement.scrollWidth,markers:marker,railX:x,branches,zoneHeights:[...paper.querySelectorAll('.poster-zone')].map(n=>n.offsetHeight),route:path.length,overflow:document.documentElement.scrollWidth-innerWidth};
   }''')
   assert d['overflow']<=3,(label,'horizontal overflow',d)
   assert d['width']==w,(label,'poster width',d)
   if w>900:
    assert len(d['branches'])==6,(label,'junction count',d)
    assert all(d['railX']<m['x']-12 for m in d['markers']),(label,'route overlaps numbered badge',d)
    assert all(br['end']<=m['x']-12 for br,m in zip(d['branches'],d['markers'])),(label,'branches overlap badges',d)
   # A real poster has varied heights rather than identical slides
   assert len(set((x//100)*100 for x in d['zoneHeights']))>=3,(label,'slide-like layout',d)
   # Interactions in three key sections, detail closes back to poster
   for zone in ('actors','conflicts','governance','solutions'):
    target=page.locator(f'[data-detail="{zone}"]').first
    await target.scroll_into_view_if_needed(timeout=7000)
    await target.click(timeout=7000)
    assert not await page.locator('#detailOverlay').evaluate('(e)=>e.hidden'),(label,zone)
    await page.locator('#detailClose').click(timeout=7000)
    await page.wait_for_timeout(300)
    assert await page.locator('#detailOverlay').evaluate('(e)=>e.hidden'),(label,zone)
   if label=='desktop':
    await page.screenshot(path=str(ROOT/'screenshots'/f'final_master_1920x{d["height"]}.png'),full_page=True,animations='disabled',timeout=30000)
   else:
    await page.screenshot(path=str(ROOT/'screenshots'/f'final_{label}.png'),full_page=False,animations='disabled',timeout=15000)
   print(label,'PASS poster=',d['width'],d['height'],'rail=',d['railX'],'min badge clearance=',round(min(m['x']-d['railX'] for m in d['markers']),1),'branches=',len(d['branches']),'zone heights=',d['zoneHeights'],'errors=',errors,'missing=',missing,flush=True)
   assert not errors and not missing,(errors,missing)
   await page.close()
  await browser.close()
if __name__=='__main__':asyncio.run(main())
