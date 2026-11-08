"""Offline Playwright QA when navigation to file:// and localhost is administratively blocked.
The sandbox-only rendition inlines the *unchanged contents* of the original JS/CSS
and uses srcdoc iframes. The published repository is NOT changed by this script.
"""
from __future__ import annotations
import asyncio, base64, mimetypes
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
SHOTS=ROOT/'screenshots'
SHOTS.mkdir(exist_ok=True)

def compiled_html(relative, embed_imgs=True):
    root=(ROOT/relative).parent
    soup=BeautifulSoup((ROOT/relative).read_text('utf-8'),'html.parser')
    for link in soup.select('link[rel="stylesheet"][href]'):
        p=root/link['href']
        assert p.exists(),p
        tag=soup.new_tag('style');tag.string=p.read_text('utf-8')
        link.replace_with(tag)
    for script in soup.select('script[src]'):
        p=root/script['src']
        assert p.exists(),p
        tag=soup.new_tag('script');tag.string=p.read_text('utf-8')
        if script.has_attr('defer'):
            script.decompose()
            soup.body.append(tag)
        else: script.replace_with(tag)
    if embed_imgs:
        for img in soup.select('img[src]'):
            src=img.get('src','')
            if src.startswith(('data:','http:','https:')):continue
            p=root/src
            if not p.exists():continue
            data=base64.b64encode(p.read_bytes()).decode('ascii')
            mime=mimetypes.guess_type(p.name)[0] or 'image/png'
            img['src']=f'data:{mime};base64,{data}'
    return str(soup)

def build_test_root():
    soup=BeautifulSoup(compiled_html('index.html',embed_imgs=True),'html.parser')
    for name in ('infographic','game'):
        frame=soup.find('iframe',id='iframe-'+name)
        frame.attrs.pop('src',None)
        frame['srcdoc']=compiled_html(f'experiences/{name}/index.html')
        frame['loading']='eager'
    # Video source is external in the published website, use poster-only for sandbox QA.
    soup.select_one('#featureVideo source').decompose()
    poster=ROOT/'assets/video/poster.jpg'
    soup.select_one('#featureVideo')['poster']='data:image/jpeg;base64,'+base64.b64encode(poster.read_bytes()).decode('ascii')
    return str(soup)

async def verify(browser,label,width,height):
    context=await browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce' if label=='mobile' else 'no-preference')
    page=await context.new_page()
    errors=[]
    page.on('pageerror',lambda err:errors.append(str(err)))
    await page.set_content(build_test_root(),wait_until='domcontentloaded',timeout=50000)
    await page.wait_for_timeout(250)
    print(label,'portal loaded',flush=True)
    assert await page.locator('#tab-infographic').get_attribute('aria-selected')=='true'
    print(label,'infographic title', await page.frame_locator('#iframe-infographic').locator('title').text_content(), 'loader:',await page.locator('#loading-infographic').get_attribute('class'),'frame status',await page.locator('#iframe-infographic').evaluate('e=>[e.contentDocument?.readyState,e.contentDocument?.URL]'),flush=True)
    await page.wait_for_timeout(500)  # let shell crossfade settle
    assert await page.locator('#loading-infographic').evaluate('e=>e.classList.contains("is-loaded")')
    await page.screenshot(path=str(SHOTS/f'3in1_{label}_infographic.png'),timeout=30000)
    await page.locator('#tab-game').click(timeout=10000)
    assert await page.locator('#tab-game').get_attribute('aria-selected')=='true'
    start=page.frame_locator('#iframe-game').locator('#startBtn')
    print(label,'game start visible',await start.is_visible(),flush=True)
    await start.click(timeout=10000)
    story=page.frame_locator('#iframe-game').locator('#story')
    print(label,'game story active',await story.evaluate('el => el.classList.contains("active")'),flush=True)
    await page.screenshot(path=str(SHOTS/f'3in1_{label}_game.png'),timeout=30000)
    await page.locator('#tab-video').click(timeout=10000)
    assert await page.locator('#view-video').get_attribute('aria-hidden')=='false'
    # The host suppresses background sound from hidden embedded pages.
    audio_muted=await page.frame_locator('#iframe-game').locator('audio').evaluate_all('(els)=>els.every(e=>e.muted)')
    assert audio_muted, 'Hidden game audio was not muted'
    await page.screenshot(path=str(SHOTS/f'3in1_{label}_video.png'),timeout=30000)
    await page.locator('#tab-game').click()
    assert await story.evaluate('el=>el.classList.contains("active")'),'state lost'
    audio_restored=await page.frame_locator('#iframe-game').locator('audio').evaluate_all('(els)=>els.every(e=>!e.muted)')
    assert audio_restored, 'Game audio not restored when returning'
    over=await page.evaluate('({viewport:innerWidth,scroll:document.documentElement.scrollWidth,active:document.querySelector("[role=tab][aria-selected=true]").dataset.tab})')
    print(label,'layout',over,'JS ERRORS',errors[:3],flush=True)
    assert over['scroll']<=over['viewport']+2,over
    # Exclude expected opaque-origin localStorage errors from browser sandbox restrictions.
    unexpected=[e for e in errors if 'localStorage' not in e and 'SecurityError' not in e]
    assert not unexpected,unexpected
    await context.close()

async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        try:
            for name,w,h in [('desktop',1920,1080),('projector',1280,720),('mobile',390,844)]:
                await verify(browser,name,w,h)
        finally:await browser.close()
if __name__=='__main__':asyncio.run(main())
