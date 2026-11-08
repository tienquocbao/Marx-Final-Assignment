"""Interaction and layout checks using the real v7 repo files in a local request router.
Does not require the Internet, installation, or a backend server.
Run: python tests/regression_v7.py
"""
import asyncio, mimetypes
from pathlib import Path
from urllib.parse import urlparse, unquote
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text(encoding='utf8').replace('<head>','<head><base href="https://poster.vcx.test/">',1)
ZONES=['context','actors','conflicts','governance','solutions','summary']

async def new_page(browser,w,h):
    page=await browser.new_page(viewport={'width':w,'height':h},accept_downloads=True)
    errors=[];missing=[];requests=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    async def serve(route):
        rel=unquote(urlparse(route.request.url).path).lstrip('/')
        file=(ROOT/rel).resolve()
        if not file.is_relative_to(ROOT) or not file.is_file():
            missing.append(rel);await route.fulfill(status=404,body='Missing: '+rel);return
        typ=mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
        if file.suffix=='.ogg':typ='audio/ogg'
        requests.append(rel)
        await route.fulfill(status=200,body=file.read_bytes(),content_type=typ)
    await page.route('**/*',serve)
    await page.set_content(HTML,wait_until='load',timeout=30000)
    return page,errors,missing,requests

async def run():
  async with async_playwright() as p:
    browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for w,h,label in [(1920,1080,'desktop'),(1280,720,'projector'),(390,844,'mobile')]:
      page,errors,missing,requests=await new_page(browser,w,h)
      await page.wait_for_timeout(350)
      d=await page.evaluate('''() => ({posterWidth:poster.offsetWidth,posterHeight:poster.offsetHeight,
        viewportWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth,
        zones:[...document.querySelectorAll('.poster-zone')].map(z=>({id:z.id,height:z.offsetHeight,overflow:z.scrollHeight-z.clientHeight})),
        bridgeCount:document.querySelectorAll('.concept-bridge').length,
        crosswalkCount:document.querySelectorAll('.crosswalk-row').length,
        routeLength:document.querySelector('#routeBase').getAttribute('d')?.length||0,
        gutter: (()=>{let z=document.querySelector('#zone-actors');let p=z.querySelector('p').getBoundingClientRect();let n=z.querySelector('.zone-number').getBoundingClientRect();return {numberRight:n.right,paragraphLeft:p.left}})()
      })''')
      assert d['posterWidth']==w, (label,d)
      assert d['bridgeCount']==5 and d['crosswalkCount']==4, d
      assert len(set(round(z['height']/100)*100 for z in d['zones']))>2, 'Layout still looks like six equal 1080px slides'
      assert d['routeLength']>170, d
      assert d['scrollWidth']<=w+3,d
      assert all(z['overflow']<3 for z in d['zones']),d
      if w>900: assert d['gutter']['numberRight']<d['gutter']['paragraphLeft']-20,d
      if label=='desktop':
        assert 6000<d['posterHeight']<8500,d
        await page.screenshot(path=str(ROOT/'screenshots'/f'infographic_master_1920x{d["posterHeight"]}.png'),full_page=True,timeout=30000)
      else:await page.screenshot(path=str(ROOT/'screenshots'/f'v7_{label}_full.png'),full_page=True,timeout=30000)
      # All 6 zones: open from actual visible button, switch tab, return to original scroll & focus.
      for z in ZONES:
        b=page.locator(f'[data-detail="{z}"]').first
        await b.scroll_into_view_if_needed(timeout=10000)
        await b.click(timeout=10000)
        before=await page.evaluate('window.VCX_APP.getState().scroll')
        assert not await page.locator('#detailOverlay').evaluate('(e)=>e.hidden'),(label,z)
        assert (await page.locator('#detailTitle').inner_text()).strip()
        assert await page.locator(f'#zone-{z if z!="summary" else "conclusion"}').evaluate('(e)=>e.classList.contains("zone-in-focus")')
        if await page.locator('.detail-tab').count()>1:await page.locator('.detail-tab').nth(1).click(timeout=10000)
        await page.locator('#detailClose').click(timeout=10000)
        await page.wait_for_timeout(330)
        assert await page.locator('#detailOverlay').evaluate('(e)=>e.hidden'),(label,z)
        after=await page.evaluate('scrollY')
        assert abs(before-after)<5,(label,z,before,after)
      # Crosswalk links navigate to the exact conceptual destination.
      first=page.locator('.crosswalk-row .link-issue').first
      await first.click(timeout=10000)
      assert (await page.evaluate('window.VCX_APP.getState().item'))=='price'
      await page.locator('#detailClose').click(timeout=10000)
      await page.wait_for_timeout(330)
      last=page.locator('.crosswalk-row .link-solution').last
      await last.click(timeout=10000)
      assert (await page.evaluate('window.VCX_APP.getState().zone'))=='solutions'
      await page.locator('#detailClose').click(timeout=10000)
      await page.wait_for_timeout(330)
      # Conflict, sources, reduced motion and Escape all retain previous functionality.
      await page.locator('#simulateButton').click(timeout=10000)
      assert await page.locator('#conflictLive').evaluate('(e)=>e.classList.contains("is-disrupted")')
      await page.locator('#simulateButton').click(timeout=10000)
      assert not await page.locator('#conflictLive').evaluate('(e)=>e.classList.contains("is-disrupted")')
      await page.locator('#sourceButton').click(timeout=10000)
      assert await page.locator('#sourcesDialog').evaluate('(e)=>e.open')
      await page.locator('#sourcesClose').click(timeout=10000)
      await page.locator('#motionButton').click(timeout=10000)
      assert await page.locator('#motionButton').get_attribute('aria-pressed')=='false'
      await page.locator('[data-detail="governance"]').first.click(timeout=10000)
      await page.keyboard.press('Escape')
      await page.wait_for_timeout(90)
      assert await page.locator('#detailOverlay').evaluate('(e)=>e.hidden')
      await page.locator('#legendTop').click(timeout=10000)
      await page.wait_for_timeout(80)
      print(f'{label} PASS: size={d["posterWidth"]}x{d["posterHeight"]}, varied zone heights={[z["height"] for z in d["zones"]]}, assets={len(requests)}; JS errors={errors}; missing={missing}')
      assert not errors and not missing, (errors,missing)
      await page.close()
    await browser.close()
if __name__=='__main__':asyncio.run(run())
