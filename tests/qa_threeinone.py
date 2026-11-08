"""Run from any directory: python tests/qa_threeinone.py (requires Playwright + Chromium).
This test routes static files from the assembled repository into a synthetic HTTPS origin;
no network/backend is required. It does not modify original web game/infographic files.
"""
from __future__ import annotations
import asyncio, mimetypes, re, json
from pathlib import Path
from urllib.parse import urlparse, unquote
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://vung-con-xanh.test'
SHOTS = ROOT / 'screenshots'
SHOTS.mkdir(exist_ok=True)

async def test_view(browser, label, width, height, full=False):
    context = await browser.new_context(viewport={'width':width,'height':height}, accept_downloads=True, reduced_motion='reduce' if label=='mobile' else 'no-preference')
    errors, missing, request_failed = [], [], []
    async def serve(route):
        url = urlparse(route.request.url)
        path = unquote(url.path).lstrip('/') or 'index.html'
        file = (ROOT/path).resolve()
        if not file.is_relative_to(ROOT) or not file.is_file():
            missing.append(path)
            await route.fulfill(status=404,body='Not found')
            return
        ct = mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
        if file.suffix=='.js':ct='application/javascript'
        if file.suffix=='.svg':ct='image/svg+xml'
        if file.suffix=='.ogg':ct='audio/ogg'
        if file.suffix=='.mp4':ct='video/mp4'
        req_range=route.request.headers.get('range','')
        if file.suffix=='.mp4' and req_range:
            match=re.match(r'bytes=(\d*)-(\d*)',req_range)
            start=int(match.group(1) or 0) if match else 0
            end=min(int(match.group(2)),file.stat().st_size-1) if match and match.group(2) else min(file.stat().st_size-1,start+1048575)
            with file.open('rb') as fp:
                fp.seek(start);data=fp.read(end-start+1)
            await route.fulfill(status=206,content_type=ct,body=data,headers={'Content-Range':f'bytes {start}-{end}/{file.stat().st_size}','Accept-Ranges':'bytes'})
        else:
            await route.fulfill(status=200,content_type=ct,body=file.read_bytes())
    await context.route('**/*',serve)
    page=await context.new_page()
    page.on('pageerror', lambda e:errors.append(str(e)))
    page.on('requestfailed',lambda req:request_failed.append(req.url))
    await page.goto(ORIGIN+'/index.html',wait_until='domcontentloaded',timeout=30000)
    assert await page.title()=='Vùng Cồn Xanh | Infographic · Web game · Video'
    assert await page.locator('#tab-infographic').get_attribute('aria-selected')=='true'
    assert await page.locator('#iframe-infographic').get_attribute('src')=='experiences/infographic/index.html'
    await page.locator('#loading-infographic.is-loaded').wait_for(timeout=20000)
    assert (await page.frame_locator('#iframe-infographic').locator('html').count())==1
    print(label,'infographic ready:', await page.frame_locator('#iframe-infographic').locator('title').text_content(), flush=True)
    await page.screenshot(path=str(SHOTS/f'portal_{label}_infographic.png'))
    await page.locator('#tab-game').click()
    await page.locator('#loading-game.is-loaded').wait_for(timeout=20000)
    assert await page.locator('#tab-game').get_attribute('aria-selected')=='true'
    assert await page.frame_locator('#iframe-game').locator('#startBtn').is_visible()
    await page.frame_locator('#iframe-game').locator('#startBtn').click(timeout=10000)
    story = page.frame_locator('#iframe-game').locator('#story')
    assert await story.evaluate('(e)=>e.classList.contains("active")'),label+' game start failed'
    print(label,'game start active: true',flush=True)
    await page.screenshot(path=str(SHOTS/f'portal_{label}_game.png'))
    await page.locator('#tab-video').click()
    assert await page.locator('#view-video').get_attribute('aria-hidden')=='false'
    assert await page.locator('#featureVideo').get_attribute('controls') is not None
    source=await page.locator('#featureVideo source').get_attribute('src')
    assert source=='assets/video/nha-nuoc-nong-nghiep-cnc.mp4'
    await page.screenshot(path=str(SHOTS/f'portal_{label}_video.png'))
    await page.locator('#tab-game').click()
    # The existing iframe remains mounted: no loss of the current story screen.
    assert await story.evaluate('(e)=>e.classList.contains("active")'),label+' state lost across tabs'
    await page.locator('#tab-infographic').click()
    assert await page.locator('#iframe-infographic').get_attribute('src')=='experiences/infographic/index.html'
    await page.locator('#tab-game').click()
    assert await page.locator('#tab-game').get_attribute('aria-selected')=='true'
    await page.go_back(wait_until='domcontentloaded') if False else None
    layout=await page.evaluate('''() => ({
      viewport:innerWidth,
      scrollWidth:document.documentElement.scrollWidth,
      selected:document.querySelector('.tab[aria-selected="true"]').dataset.tab,
      transition:getComputedStyle(document.querySelector('.experience')).transitionDuration,
      gameFrame:!!document.querySelector('#iframe-game').contentWindow
    })''')
    assert layout['scrollWidth']<=layout['viewport']+2,layout
    if errors: print(label,'PAGE ERRORS:',errors[:5],flush=True)
    if missing: print(label,'MISSING REQUESTS:',missing[:5],flush=True)
    if request_failed: print(label,'FAILED:',request_failed[:5],flush=True)
    assert not errors,errors
    assert not missing,missing
    assert not request_failed,request_failed
    await context.close()
    return layout

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        try:
            for label,w,h in [('desktop',1920,1080),('projector',1280,720),('mobile',390,844)]:
                result=await test_view(b,label,w,h)
                print('PASS',label,result,flush=True)
        finally:
            await b.close()

if __name__=='__main__':asyncio.run(main())
