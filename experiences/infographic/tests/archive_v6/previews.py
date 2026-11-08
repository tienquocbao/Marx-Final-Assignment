import asyncio
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
from smoke import page_for,ROOT
from playwright.async_api import async_playwright

async def run():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page,errs,missing,_=await page_for(browser,1280,720)
  await page.locator('[data-detail="governance"][data-item="legal"]').first.scroll_into_view_if_needed()
  await page.locator('[data-detail="governance"][data-item="legal"]').first.click()
  await page.wait_for_timeout(165)
  print('ghost mid?',await page.locator('.shared-ghost').count())
  await page.screenshot(path=str(ROOT/'screenshots/transition_midway.png'))
  await page.wait_for_timeout(650)
  await page.screenshot(path=str(ROOT/'screenshots/detail_governance.png'))
  await page.locator('[data-item-tab="dispute"]').click()
  await page.screenshot(path=str(ROOT/'screenshots/detail_governance_dispute.png'))
  await page.locator('#detailClose').click();await page.wait_for_timeout(350)
  print('source screenshot errors',errs,missing)
  await page.close()
  mobile,errs,missing,_=await page_for(browser,390,844)
  await mobile.locator('[data-detail="conflicts"][data-item="fees"]').first.scroll_into_view_if_needed()
  await mobile.locator('[data-detail="conflicts"][data-item="fees"]').first.click()
  await mobile.wait_for_timeout(650)
  await mobile.screenshot(path=str(ROOT/'screenshots/mobile_detail_conflicts.png'))
  print('mobile preview errors',errs,missing)
  await mobile.close();await browser.close()

asyncio.run(run())
# Build an honest preview montage from screenshot of actual page.
poster=Image.open(ROOT/'screenshots/master_1920x6480.png').convert('RGB')
assert poster.size==(1920,6480)
W,H=1970,1730
canvas=Image.new('RGB',(W,H),'#f2f7ed')
d=ImageDraw.Draw(canvas)
try:
 font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',35)
except: font=ImageFont.load_default()
for i in range(6):
 src=poster.crop((0,i*1080,1920,(i+1)*1080))
 src=src.resize((940,529),Image.Resampling.LANCZOS)
 x=25+(i%2)*985;y=32+(i//2)*567
 d.rounded_rectangle((x-4,y-4,x+944,y+533),radius=10,fill='#ffffff',outline='#9bc8aa',width=3)
 canvas.paste(src,(x,y))
canvas.save(ROOT/'screenshots/preview_6_zones.jpg',quality=91,optimize=True)
print('montage created',ROOT/'screenshots/preview_6_zones.jpg')
