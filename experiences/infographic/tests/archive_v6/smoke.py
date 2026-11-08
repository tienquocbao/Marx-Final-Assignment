import asyncio,mimetypes
from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text(encoding='utf-8').replace('<head>','<head><base href="https://poster.vcx.test/">',1)
async def page_for(browser,w,h):
 page=await browser.new_page(viewport={'width':w,'height':h},accept_downloads=True)
 errors=[];missing=[];requests=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 async def route(r):
  rel=unquote(urlparse(r.request.url).path).lstrip('/')
  file=(ROOT/rel).resolve()
  if not file.is_relative_to(ROOT) or not file.is_file():
   missing.append(rel);await r.fulfill(status=404,body='Missing: '+rel);return
  ct=mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
  if file.suffix=='.ogg':ct='audio/ogg'
  requests.append(rel)
  await r.fulfill(status=200,body=file.read_bytes(),content_type=ct)
 await page.route('**/*',route)
 await page.set_content(HTML,wait_until='load',timeout=30000)
 return page,errors,missing,requests
async def run():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h,label in [(1920,1080,'desktop'),(1280,720,'projector'),(390,844,'mobile')]:
   page,errors,missing,requests=await page_for(browser,w,h)
   dimensions=await page.evaluate('''() => ({posterWidth:document.querySelector('#poster').offsetWidth,posterHeight:document.querySelector('#poster').offsetHeight,scrollWidth:document.documentElement.scrollWidth,windowWidth:innerWidth,zones:[...document.querySelectorAll('.poster-zone')].map(el=>({id:el.id,h:el.offsetHeight,overflow:el.scrollHeight-el.clientHeight}))})''')
   print(label,'dimensions',dimensions)
   if label=='desktop':
    assert dimensions['posterWidth']==1920, dimensions
    assert dimensions['posterHeight']==6480,dimensions
    await page.screenshot(path=str(ROOT/'screenshots/master_1920x6480.png'),full_page=True,timeout=30000)
   else:assert dimensions['scrollWidth']<=dimensions['windowWidth']+3,dimensions
   # Open all 6 regions & return to exact scroll offset.
   for zone in ['context','actors','conflicts','governance','solutions','summary']:
    button=page.locator(f'[data-detail="{zone}"]').first
    await button.scroll_into_view_if_needed(timeout=10000)
    original=await page.evaluate('scrollY')
    await button.click(timeout=10000)
    assert not await page.locator('#detailOverlay').evaluate('(el)=>el.hidden'),zone
    assert (await page.locator('#detailTitle').inner_text()).strip(),zone
    tabs=page.locator('.detail-tab')
    if await tabs.count()>1:await tabs.nth(1).click(timeout=10000)
    await page.locator('#detailClose').click(timeout=10000)
    await page.wait_for_timeout(400)
    assert await page.locator('#detailOverlay').evaluate('(el)=>el.hidden'),zone
    restored=await page.evaluate('scrollY')
    assert abs(original-restored)<=4,(zone,original,restored)
   # Read source dialog, simulate conflict, check reducer motion.
   await page.locator('#sourceButton').click(timeout=5000)
   assert await page.locator('#sourcesDialog').evaluate('(e)=>e.open')
   await page.locator('#sourcesClose').click(timeout=5000)
   await page.locator('#simulateButton').click(timeout=10000)
   assert await page.locator('#conflictLive').evaluate("e=>e.classList.contains('is-disrupted')")
   await page.locator('#simulateButton').click(timeout=10000)
   await page.locator('#motionButton').click(timeout=5000)
   assert await page.locator('#motionButton').get_attribute('aria-pressed')=='false'
   await page.locator('[data-detail="governance"]').first.click(timeout=10000)
   assert not await page.locator('#detailOverlay').evaluate('(e)=>e.hidden')
   await page.keyboard.press('Escape')
   await page.wait_for_timeout(100)
   assert await page.locator('#detailOverlay').evaluate('(e)=>e.hidden')
   print(label,'PASS','pageErrors',errors,'missingAssets',missing,'requests',len(requests))
   assert not errors, errors
   assert not missing, missing
   if label=='projector':await page.screenshot(path=str(ROOT/'screenshots/projector_1280x720.png'),full_page=False)
   if label=='mobile':await page.screenshot(path=str(ROOT/'screenshots/mobile_390x844.png'),full_page=False)
   await page.close()
  await browser.close()
if __name__=='__main__':asyncio.run(run())
