import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
from qa_final_v8 import page_for,ROOT
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h,label in [(1600,900,'desktop_1600'),(1366,768,'laptop_1366'),(1024,768,'laptop_1024')]:
   page,errors,missing=await page_for(browser,w,h)
   info=await page.evaluate('''() =>{const p=poster,pr=p.getBoundingClientRect(),m=[...p.querySelectorAll('.zone-number')].map(el=>el.getBoundingClientRect().left-pr.left);const d=routeBase.getAttribute('d'),x=Number(d.match(/^M ([\\d.]+)/)[1]);return {w:p.clientWidth,h:p.scrollHeight,x,clearance:Math.min(...m)-x,overflow:document.documentElement.scrollWidth-innerWidth}}''')
   assert info['clearance']>=20 and info['overflow']<=3,(label,info)
   print(label,'PASS',info,flush=True)
   await page.close()
  page,errors,missing=await page_for(browser,1280,720)
  await page.locator('#sourceButton').click();assert await page.locator('#sourcesDialog').evaluate('(d)=>d.open')
  await page.locator('#sourcesClose').click()
  await page.locator('#motionButton').click()
  assert await page.locator('#motionButton').get_attribute('aria-pressed')=='false'
  assert await page.evaluate('document.documentElement.classList.contains("reduce-custom-motion")')
  await page.locator('#simulateButton').click()
  assert await page.locator('#conflictLive').evaluate('(e)=>e.classList.contains("is-disrupted")')
  await page.locator('#simulateButton').click()
  assert not await page.locator('#conflictLive').evaluate('(e)=>e.classList.contains("is-disrupted")')
  await page.locator('[data-detail="governance"]').first.click()
  assert not await page.locator('#detailOverlay').evaluate('(e)=>e.hidden')
  await page.keyboard.press('Escape');await page.wait_for_timeout(120)
  assert await page.locator('#detailOverlay').evaluate('(e)=>e.hidden')
  assert not errors and not missing,(errors,missing)
  print('SOURCE / MOTION TOGGLE / CONFLICT / ESCAPE: PASS',flush=True)
  await page.close();await browser.close()
if __name__=='__main__':asyncio.run(main())
