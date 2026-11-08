"""Production pages without the compatibility bridge: isolated offline and state replacement."""
from pathlib import Path
import json
import tempfile
import shutil
import sys
from playwright.sync_api import sync_playwright
from browser_support import launch_browser

ROOT=Path(__file__).resolve().parent.parent
ART=ROOT/'artifacts/qa'
tests=[]
def check(name,value,details=''):
    tests.append({'name':name,'status':'PASS' if value else 'FAIL','details':details})
    print(tests[-1]['status'],name,details,flush=True)
fixture=json.loads((ROOT/'artifacts/modular-baseline/simulation.json').read_text())['examples']['A']
fixture['stage']='hall'
fixture['memory']['bay']['history']=[{'serial':1,'choice':'Bản trước refactor','critical':[],'evidence':['field_buyer']}]
fixture['learning']['quiz']['answers']=[2,1]
with tempfile.TemporaryDirectory(prefix='vcx-modular-cold-') as temp, sync_playwright() as p:
    standalone=Path(temp)/'release.html'
    shutil.copy2(ROOT/'dist/Vung_Con_Xanh_v8_0_Offline.html',standalone)
    browser=launch_browser(p)
    for label,url in [('source',(ROOT/'index.html').as_uri()),('standalone',standalone.as_uri())]:
        context=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        context.set_offline(True)
        errors=[];failed=[];external=[]
        page=context.new_page()
        page.set_default_timeout(10000)
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('requestfailed',lambda r:failed.append(r.url) if r.failure!='net::ERR_ABORTED' else None)
        page.on('request',lambda r:external.append(r.url) if r.url.startswith(('http://','https://')) else None)
        # This is a genuine v8 schema snapshot made before modularization.
        page.add_init_script('localStorage.setItem("vcx_v80",'+json.dumps(json.dumps(fixture))+');')
        try:
            page.goto(url)
            check(label+' exposes no legacy gameplay globals',page.evaluate("typeof state==='undefined'&&typeof scene==='undefined'&&typeof renderHall==='undefined'&&typeof VCXSim==='undefined'&&typeof VCX_DATA==='undefined'"))
            check(label+' module API is cached and bootstrap runs once',page.evaluate("VCX.get('app')===VCX.get('app')&&Object.isFrozen(VCX)&&!document.querySelector('script[type=module]')"))
            check(label+' music still waits for gesture',page.evaluate("!VCX.get('app').audio.musicStarted&&document.getElementById('music_day').paused"))
            page.click('#resumeBtn');page.wait_for_selector('#hall.active')
            saved=page.evaluate('JSON.parse(localStorage.getItem("vcx_v80"))')
            check(label+' resumes pre-refactor v8 evidence, policies, memory and quiz',saved['found']==fixture['found'] and saved['policies']==fixture['policies'] and saved['memory']==fixture['memory'] and saved['learning']['quiz']['answers']==[2,1])
            page.click('#checkAgreement')
            for action in ['alert','verify','apply']:
                button=page.locator(f'#crisisChoices [data-action={action}]')
                if button.is_enabled():button.click()
            page.click('#crisisCommit');page.wait_for_selector('#ending.active')
            check(label+' original v8 save reaches A through UI',page.evaluate("VCX.get('app').store.state.result==='A'"))
            page.click('#downloadDecisionReport')
            page.click('#reviseAgreement');page.wait_for_selector('#hall.active')
            check(label+' revise clears result and restores editable negotiation',page.evaluate("VCX.get('app').store.state.result===null&&VCX.get('app').store.state.crisis===null"))
            page.once('dialog',lambda d:d.accept());page.click('#restartBtn');page.wait_for_selector('#home.active')
            page.check('#demoMode');page.click('#startBtn');page.click('#skipStory')
            page.click('.mapPin[data-go=field]');page.wait_for_selector('#explore.active')
            page.click('[data-clue=field_buyer]');page.click('#modalOkay');page.wait_for_selector('#clueModal:not(.show)',state='attached')
            current=page.evaluate('VCX.get("app").store.state')
            check(label+' handlers follow fresh state after reset and begin',current['found']['field']==['field_cost','field_sensor','field_buyer'] and current['memory']['bay']['history'][0]['choice']!='Bản trước refactor' and current['learning']['quiz']['answers']==[] and current['policies']=={})
            page.click('#knowledgeBtn');page.keyboard.press('Escape')
            check(label+' mobile knowledge and keyboard focus remain usable',page.evaluate("document.activeElement.id==='knowledgeBtn'&&document.documentElement.scrollWidth<=innerWidth"))
            check(label+' no runtime errors, failed requests or internet',not errors and not failed and not external,json.dumps({'errors':errors,'failed':failed,'external':external}))
        except Exception as e:
            check(label+' production journey',False,str(e))
        context.close()
    browser.close()
(ART/'modular-browser.json').write_text(json.dumps({'tests':tests},ensure_ascii=False,indent=2))
sys.exit(1 if any(t['status']!='PASS' for t in tests) else 0)
