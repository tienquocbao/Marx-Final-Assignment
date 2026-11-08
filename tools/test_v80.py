"""Browser regression: real UI journeys, error boundaries, migration and cold offline.
Run: uv run --with playwright python tools/test_v80.py
"""
from pathlib import Path
import contextlib
import functools
import http.server
import json
import shutil
import tempfile
import threading
import sys
from playwright.sync_api import sync_playwright
from browser_support import launch_browser

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / 'artifacts' / 'qa'
SHOTS = ROOT / 'screenshots' / 'v80'
ART.mkdir(parents=True, exist_ok=True)
SHOTS.mkdir(parents=True, exist_ok=True)
results = []
all_errors = []
all_failed = []
cancelled_requests = []

def check(name, value, detail=''):
    item = {'name': name, 'status': 'PASS' if value else 'FAIL', 'details': detail}
    results.append(item)
    print(item['status'], name, detail, flush=True)
    return value

def scenario(name, fn):
    try:
        fn()
    except Exception as e:
        check(name, False, str(e))

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{server.server_port}/index.html'

with sync_playwright() as playwright:
    browser = launch_browser(playwright)
    def new_page(width=1366, height=900, offline=False, storage=None, url=URL, reduced=False):
        context = browser.new_context(viewport={'width': width, 'height': height}, reduced_motion='reduce' if reduced else 'no-preference', accept_downloads=True)
        if offline:
            context.set_offline(True)
        page = context.new_page()
        page.set_default_timeout(10000)
        page.on('pageerror', lambda error: all_errors.append(str(error)))
        def request_failed(request):
            item={'url':request.url,'error':request.failure}
            (cancelled_requests if request.failure=='net::ERR_ABORTED' else all_failed).append(item)
        page.on('requestfailed', request_failed)
        page.on('response', lambda response: all_failed.append(f'{response.status} {response.url}') if response.status >= 400 else None)
        if storage:
            page.add_init_script(storage)
        page.goto(url)
        return page

    def start(page, demo=False):
        if demo:
            page.check('#demoMode')
        page.click('#startBtn')
        page.wait_for_selector('#story.active')
        page.click('#skipStory')
        page.wait_for_selector('#world.active')

    def investigate(page, place, walking=False):
        if walking:
            page.click(f'.mapPin[data-go={place}]')
            page.wait_for_function(f"nearbySite()==='{place}'")
            page.keyboard.press('e')
        else:
            # UI route in demo mode enters immediately (documented presentation behavior).
            page.click(f'.mapPin[data-go={place}]')
        page.wait_for_selector('#explore.active')
        clues=page.evaluate(f'SCENES.{place}.hotspots.map(h=>h.id)')
        for clue in clues:
            if page.evaluate(f"state.found.{place}.includes('{clue}')"):
                continue
            page.click(f'[data-clue={clue}]')
            page.click('#modalOkay')
            page.wait_for_selector('#clueModal:not(.show)', state='attached')
        # Each mini-game is actually solved, with an invalid attempt first.
        if place=='field':
            page.locator('#priceSlider').fill('70')
            page.click('#miniCheck')
            check('Price minigame rejects below-cost proposal', not page.evaluate('state.minis.field'))
            page.locator('#priceSlider').fill('85')
        elif place=='coop':
            page.click('#miniCheck')
            check('Fee minigame rejects empty matching', not page.evaluate('state.minis.coop'))
            for key in ['warehouse','test','trace']:
                page.select_option('#match_'+key, key)
        else:
            page.click('[data-lot=B]')
            page.click('#miniCheck')
            check('Quality minigame rejects ineligible lot', not page.evaluate('state.minis.factory'))
            page.click('[data-lot=B]')
            page.click('[data-lot=A]')
            page.click('[data-lot=C]')
        page.click('#miniCheck')
        check('Actual minigame '+place, page.evaluate(f'state.minis.{place}'))
        page.click('#talkNPC')
        page.click('#finishPlace')
        page.wait_for_selector('#world.active')

    def board_and_invite(page, walking=False):
        page.click('#hallPin')
        if walking:
            page.wait_for_function("nearbySite()==='hall'")
            page.keyboard.press('e')
        page.wait_for_selector('#board.active')
        # Wrong match must not unlock the meeting.
        page.click('[data-evidence=field_buyer]')
        page.click('[data-slot=fees]')
        check('Clue board rejects mismatched evidence', page.locator('#enterHall').is_disabled())
        for issue, clue in [('price','field_buyer'),('fees','coop_fees'),('risk','field_sensor')]:
            page.click(f'[data-evidence={clue}]')
            page.click(f'[data-slot={issue}]')
        page.click('#enterHall')
        page.click('[data-invite-clue=field_sensor]')
        page.click('[data-invite-person=bay]')
        check('Invitation rejects unrelated proof', not page.evaluate('state.invited.bay'))
        for who, clue in [('bay','field_buyer'),('sen','coop_fees'),('khoa','factory_quality')]:
            page.click(f'[data-invite-clue={clue}]')
            page.click(f'[data-invite-person={who}]')
        page.click('#inviteProceed')
        page.wait_for_selector('#hall.active')
        check('Evidence collection, board and voluntary invitations', page.evaluate('Object.values(state.found).flat().length===9&&inviteReady()&&Object.keys(state.board).length===3'))

    def configure(page, policies, tools):
        if page.locator('#demoExpand').count() and not page.evaluate('state.demoExpanded'):
            page.click('#demoExpand')
        for key, val in policies.items():
            page.click(f'[data-policy={key}][data-pick={val}]')
        for tool, val in tools.items():
            proof={'rights':'coop_contract','harmony':'coop_fees','prevent':'field_sensor','resolve':'coop_contract'}[tool]
            page.click(f'[data-proof-tool={tool}][data-proof-id={proof}]')
            page.click(f'[data-gov={tool}][data-gov-pick={val}]')

    def crisis(page, prepared=True):
        page.click('#checkAgreement')
        check('Crisis switches tension soundtrack', page.evaluate("currentMusic==='tension'"))
        for action in (['alert','verify','apply'] if prepared else ['apply','verify','alert']):
            if page.locator(f'[data-action={action}]').is_enabled():
                page.click(f'[data-action={action}]')
        page.click('#crisisCommit')
        page.wait_for_selector('#ending.active')

    full_save = None
    def full_journey():
        global full_save
        page=new_page()
        check('Audio waits for a user gesture', page.evaluate('!musicStarted&&MUSIC.day.paused&&MUSIC.tension.paused'))
        # Keyboard activates native buttons; no custom Enter double-advance.
        page.focus('#startBtn');page.keyboard.press('Enter')
        check('Keyboard starts the story', page.locator('#story.active').count()==1)
        page.focus('#nextStory');page.keyboard.press('Enter')
        check('Enter advances exactly one story line', page.evaluate('storyPos===1'))
        for _ in range(9):
            page.click('#nextStory')
        page.wait_for_selector('#world.active')
        check('Full opening story reaches map', True)
        page.keyboard.down('a');page.wait_for_timeout(250);page.keyboard.up('a')
        check('Map keyboard movement', page.evaluate('state.mapPos.x<50&&mapWalking.faceLeft'))
        for place in ['field','coop','factory']:
            investigate(page,place,True)
        # Both optional tasks are completed through their real UI; wrong ordering is rejected.
        for quest,steps in [('water',['morning','mid','noon']),('dock',['gather','check','receive'])]:
            page.click(f'.mapPin[data-go={quest}]');page.wait_for_function(f"nearbySite()==='{quest}'");page.keyboard.press('e')
            for step in reversed(steps):page.click(f'[data-step={step}]')
            check('Side quest rejects wrong order '+quest,not page.evaluate(f'state.sideQuests.{quest}'))
            page.wait_for_timeout(950)
            for step in steps:page.click(f'[data-step={step}]')
            check('Actual optional task '+quest,page.evaluate(f'state.sideQuests.{quest}'))
            page.click('#questExit')
        board_and_invite(page,True)
        # No proof, no proposal.
        page.click('[data-policy=price][data-pick=fair]');page.click('[data-policy=fees][data-pick=fair]');page.click('[data-policy=risk][data-pick=fair]')
        page.click('[data-gov=rights][data-gov-pick=document]')
        check('Governance rejects missing evidence', not page.evaluate('!!state.governance.rights'))
        configure(page,{'price':'fair','fees':'fair','risk':'fair'},{'rights':'document','harmony':'training','prevent':'targeted','resolve':'mediate'})
        original=page.evaluate('VCXSim.dialogue(state,2,VCX_DATA).text')
        page.click('[data-policy=price][data-pick=premium]')
        check('NPC veto with high total benefit', page.evaluate("evaluate().actors[2].critical.includes('margin')&&evaluate().vals.reduce((a,b)=>a+b,0)>230"))
        page.click('[data-policy=price][data-pick=fair]')
        check('NPC remembers harmful proposal and its repair', page.evaluate("state.memory.khoa.seenConcerns.includes('margin')&&VCXSim.dialogue(state,2,VCX_DATA).text.includes('Bản sửa')"))
        check('Adaptive dialogue changed', original!=page.evaluate('VCXSim.dialogue(state,2,VCX_DATA).text'))
        page.click('#knowledgeBtn')
        check('Knowledge panel and 9 evidence concept map', page.locator('.knowledgeCard').count()==1 and page.locator('[data-concept-clue]').count()==9)
        page.select_option('#knowledgeSelect','coop_fees')
        page.screenshot(path=str(SHOTS/'knowledge-desktop.png'),full_page=True)
        check('Contextual HTX economic explanation', 'Lợi ích cá nhân, tập thể và xã hội' in page.locator('#learningBody').inner_text())
        page.keyboard.press('Escape')
        check('Native dialog Escape and focus restoration', not page.locator('#learningDialog').evaluate('(e)=>e.open') and page.locator('#knowledgeBtn').evaluate('(e)=>e===document.activeElement'))
        for actor in ['bay','sen','khoa']:
            page.click('#debateBtn')
            page.click(f'[data-debate-actor={actor}]')
            page.click('#submitDebate')
            check('Debate rejects incomplete argument '+actor,'Cần chọn đủ' in page.locator('#debateResult').inner_text())
            data=page.evaluate(f'VCXContent.debates.{actor}')
            for selector, value in [('debateConcept',data['conceptAnswer']),('debateCause',data['causeAnswer']),('debateResponse',data['responseAnswer'])]:
                page.select_option('#'+selector,str(value))
            page.select_option('#debateProof',data['proofs'][0])
            # Deliberately wrong order first.
            for step in ['response','claim','evidence']:
                page.click(f'[data-order={step}]')
            page.click('#submitDebate')
            check('Debate penalizes illogical order '+actor, page.evaluate(f'state.learning.debates.{actor}.rubric[1]<2'))
            page.click('#debateReset')
            for step in ['claim','evidence','response']:
                page.click(f'[data-order={step}]')
            page.click('#submitDebate')
            page.screenshot(path=str(SHOTS/f'debate-{actor}.png'),full_page=True)
            check('Contextual structured debate '+actor, page.evaluate(f'state.learning.debates.{actor}.rubric.reduce((a,b)=>a+b,0)===8'))
            page.click('#learningClose')
        # Read the three hearing tabs as an actual recorded behavior.
        for i in range(3):
            page.click(f'[data-hear="{i}"]')
        page.screenshot(path=str(SHOTS/'hall-desktop.png'),full_page=True)
        full_save=page.evaluate('JSON.parse(JSON.stringify(state))')
        page.click('#checkAgreement');page.keyboard.press('Escape')
        check('Escape from crisis restores day music and editable hall',page.evaluate("currentMusic==='day'&&scene==='hall'&&!state.crisis"))
        crisis(page)
        check('Ending A through actual gameplay',page.evaluate("state.result==='A'&&Object.values(evaluate().checks).every(Boolean)"))
        check('Debrief shows reasons and behavior-based profile',page.locator('#debriefSection .assessmentItem').count()==5 and 'Niềm tin chung' in page.locator('#debriefSection').inner_text())
        page.click('#quizBtn')
        page.click('#quizNext')
        check('Quiz rejects unanswered item','Chọn một phương án' in page.locator('#quizFeedback').inner_text())
        answers=page.evaluate('VCXContent.quiz.map(q=>q.answer)')
        for i, answer in enumerate(answers):
            # Leave one wrong answer for meaningful review and distractor explanation.
            page.check(f'[name=quizAnswer][value="{(answer+1)%4 if i==3 else answer}"]')
            if i==4:
                page.click('#learningClose');page.reload();page.click('#resumeBtn');page.click('#quizBtn')
                for _ in range(4):
                    page.click('#quizNext')
                check('Quiz answers survive actual storage reload',page.evaluate('state.learning.quiz.answers[4]!==undefined'))
            page.click('#quizNext')
        page.screenshot(path=str(SHOTS/'quiz-desktop.png'),full_page=True)
        check('10-question assessment includes wrong-option explanations', '9/10' in page.locator('#learningBody').inner_text() and page.locator('.quizReview li').count()==40)
        with page.expect_download() as info:
            page.click('#quizExport')
        download=info.value;out=ART/'learning-report.txt';download.save_as(str(out))
        report=out.read_text()
        check('TXT export contains actual decisions, profile, quiz and remediation', all(t in report for t in ['HỒ SƠ HỌC TẬP V8.0','9/10','LỊCH SỬ QUYẾT ĐỊNH','KHUYẾN NGHỊ','Chị Sen']))
        page.click('#learningClose');check('Learning dashboard integrates quiz and debate results','9/10' in page.locator('#debriefSection').inner_text() and 'điểm lập luận' in page.locator('#debriefSection').inner_text());page.screenshot(path=str(SHOTS/'ending-a-desktop.png'),full_page=True)
        before=page.evaluate('JSON.stringify({memory:state.memory,learning:state.learning,result:state.result})')
        page.reload();page.click('#resumeBtn')
        check('Resume retains NPC memory, learning and ending',before==page.evaluate('JSON.stringify({memory:state.memory,learning:state.learning,result:state.result})'))
        page.context.close()
    scenario('Full UI journey',full_journey)

    def branches():
        if not full_save:
            raise AssertionError('Full journey did not reach hall; branch fixture unavailable')
        for result, policies, tools, prepared in [
            ('B',{'price':'premium','fees':'fair','risk':'fair'},{'rights':'document','harmony':'training','prevent':'targeted','resolve':'mediate'},True),
            ('C',{'price':'premium','fees':'deferred','risk':'pause'},{'rights':'template','harmony':'credit','prevent':'pause','resolve':'formal'},False),
            ('A',{'price':'phased','fees':'fair','risk':'reserve'},{'rights':'document','harmony':'link','prevent':'targeted','resolve':'neutral'},True),
        ]:
            # Real hall checkpoint from completed investigation, then actual UI decisions and event.
            storage='localStorage.setItem("vcx_v80",'+json.dumps(json.dumps(full_save))+');'
            page=new_page(width=390 if result=='C' else 1280,height=844 if result=='C' else 720,storage=storage)
            page.click('#resumeBtn');configure(page,policies,tools);crisis(page,prepared)
            actual=page.evaluate('state.result')
            check(f'Checkpoint UI decisions → ending {result}',actual==result,f'actual {actual}')
            check(f'Ending {result} has no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            page.screenshot(path=str(SHOTS/f'ending-{result.lower()}-branch.png'),full_page=True)
            page.context.close()
    scenario('Branches B/C and alternative A',branches)

    def demo_journey():
        page=new_page(width=390,height=844,reduced=True)
        start(page,True)
        for place in ['field','coop','factory']:
            investigate(page,place)
        board_and_invite(page)
        check('Presentation prepares 2 policies and 2 tools',page.evaluate("state.policies.price==='fair'&&state.policies.fees==='fair'&&state.governance.rights==='document'&&state.governance.harmony==='training'"))
        check('Prepared decisions are not credited as player actions',page.evaluate("learningProfile()[4].score===0&&state.decisions.some(d=>d.source==='prepared')"))
        page.click('[data-policy=risk][data-pick=fair]')
        for tool,pick,proof in [('prevent','targeted','field_sensor'),('resolve','mediate','coop_contract')]:
            page.click(f'[data-proof-tool={tool}][data-proof-id={proof}]');page.click(f'[data-gov={tool}][data-gov-pick={pick}]')
        for who in range(3):
            page.click(f'[data-hear="{who}"]')
        for button in ['#knowledgeBtn','#learningBtn','#debateBtn']:
            page.click(button)
            check('390px '+button+' responsive',page.evaluate("document.documentElement.scrollWidth<=innerWidth&&document.getElementById('learningDialog').scrollWidth<=document.getElementById('learningDialog').clientWidth+1"))
            page.click('#learningClose')
        crisis(page)
        check('Presentation mode and mobile Ending A',page.evaluate("state.result==='A'"))
        page.screenshot(path=str(SHOTS/'ending-mobile.png'),full_page=True)
        page.click('#quizBtn')
        check('390px quiz fits viewport',page.evaluate("document.getElementById('learningDialog').scrollWidth<=document.getElementById('learningDialog').clientWidth+1"))
        check('Reduced motion disables scene and weather animation',page.evaluate("getComputedStyle(document.querySelector('.sceneWeather')).animationName==='none'"))
        page.context.close()
    scenario('Mobile presentation UI journey',demo_journey)

    def boundaries():
        storage='localStorage.setItem("vcx_v80","{broken");'
        page=new_page(storage=storage);page.click('#startBtn');check('Corrupt JSON does not break start',page.locator('#story.active').count()==1);page.context.close()
        if full_save:
            old=dict(full_save);old.pop('memory',None);old.pop('learning',None);old.pop('saveVersion',None)
            storage='localStorage.setItem("vcx_v71",'+json.dumps(json.dumps(old))+');'
            page=new_page(storage=storage);backup=page.evaluate("localStorage.getItem('vcx_v71')");page.click('#knowledgeBtn');page.click('#learningClose')
            check('Home knowledge preview preserves resumable checkpoint',page.evaluate("localStorage.getItem('vcx_v80')===null") and page.evaluate("localStorage.getItem('vcx_v71')")==backup)
            page.click('#resumeBtn')
            check('Actual v71 localStorage migration and preserved backup',page.evaluate("state.saveVersion===8&&state.found.field.length===3&&localStorage.getItem('vcx_v71')!==null&&localStorage.getItem('vcx_v80')!==null"))
            check('Migration does not invent learning behaviors',page.evaluate('state.learning.heard.length===0&&state.learning.invitations.length===0'))
            page.context.close()
        if full_save:
            malformed=dict(full_save);malformed['stage']='ending';malformed['result']='B';malformed['decisions']=[{'kind':'policy','key':'price','id':'fair','at':{'bad':1},'effects':'wrong','evidence':'wrong','consequences':123}]
            malformed['learning']={'viewed':['unknown'],'heard':['unknown']*20}
            page=new_page(storage='localStorage.setItem("vcx_v80",'+json.dumps(json.dumps(malformed))+');')
            page.click('#resumeBtn');page.click('#learningBtn')
            check('Malformed nested learning and decision data remain usable',page.locator('#learningDialog').evaluate('(e)=>e.open') and page.evaluate('state.learning.heard.length===0'))
            page.context.close()
        page=new_page(storage="localStorage.setItem('vcx_v80',JSON.stringify({saveVersion:99,found:{},policies:{}}));")
        page.click('#startBtn')
        check('Future schema is not overwritten',page.evaluate("JSON.parse(localStorage.getItem('vcx_v80')).saveVersion===99"));page.context.close()
        page=new_page(storage="Storage.prototype.setItem=()=>{throw new DOMException('quota','QuotaExceededError')};")
        page.click('#startBtn')
        check('Storage failure warns and game remains playable',page.locator('#story.active').count()==1 and 'Không lưu được' in page.locator('#toast').inner_text());page.context.close()
        page=new_page();start(page,True);page.click('[data-go=field]');page.click('[data-clue=field_cost]')
        page.focus('#modalOkay');page.keyboard.press('Tab')
        check('Legacy evidence modal traps Tab',page.locator('#closeModal').evaluate('(e)=>e===document.activeElement'))
        pos=page.evaluate('JSON.stringify(state.mapPos)');page.keyboard.press('a');check('Map keys do not move through modal',pos==page.evaluate('JSON.stringify(state.mapPos)'))
        page.keyboard.press('Escape')
        page.once('dialog',lambda d:d.dismiss());page.click('#restartBtn')
        check('Cancel reset preserves progress',page.evaluate("state.found.field.length===2"))
        page.once('dialog',lambda d:d.accept());page.click('#restartBtn')
        check('Confirmed reset returns home with new save',page.evaluate("scene==='home'&&Object.values(state.found).flat().length===0&&JSON.parse(localStorage.getItem('vcx_v80')).stage==='home'"))
        page.context.close()
    scenario('Save and input boundaries',boundaries)

    def offline_assets():
        for name,url in [('source', (ROOT/'index.html').as_uri()),('standalone',(ROOT/'dist/Vung_Con_Xanh_v8_0_Offline.html').as_uri())]:
            if name=='standalone':
                temp=Path(tempfile.mkdtemp(prefix='vcx-offline-'))
                shutil.copyfile(ROOT/'dist/Vung_Con_Xanh_v8_0_Offline.html',temp/'game.html')
                url=(temp/'game.html').as_uri()
            page=new_page(offline=True,url=url)
            check('Cold offline '+name+' starts',page.locator('#home.active').count()==1)
            start(page,True)
            page.click('[data-go=field]')
            page.click('[data-clue=field_buyer]');page.click('#modalOkay');page.wait_for_timeout(150)
            page.click('#knowledgeBtn')
            check('Offline '+name+' includes new panels',page.locator('.knowledgeCard').count()==1)
            page.click('#learningClose')
            loaded=page.evaluate('''async()=>{
             const sources=[...Object.values(PORTRAITS),...Object.values(SCENE_ASSETS),...Object.values(SPRITES)];
             return await Promise.all(sources.map(src=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(i.naturalWidth>0);i.onerror=()=>resolve(false);i.src=src;})));
            }''')
            check('Offline '+name+' all 49 images decode',len(loaded)==49 and all(loaded))
            audio=page.evaluate('''async()=>{
             const sources=[MUSIC.day.src,MUSIC.tension.src,...Object.values(SFX_ASSETS)];
             return await Promise.all(sources.map(src=>new Promise(resolve=>{const a=new Audio();a.preload='metadata';const timer=setTimeout(()=>resolve(false),6000);a.onloadedmetadata=()=>{clearTimeout(timer);resolve(a.duration>0);};a.onerror=()=>{clearTimeout(timer);resolve(false);};a.src=src;})));
            }''')
            check('Offline '+name+' all 9 OGG metadata load',len(audio)==9 and all(audio))
            check('CSS loaded '+name,page.evaluate("getComputedStyle(document.querySelector('.home')).backgroundColor!=='rgba(0, 0, 0, 0)'"))
            if name=='standalone':
                page.locator('#priceSlider').fill('85');page.click('#miniCheck');page.click('#finishPlace')
                for place in ['coop','factory']:investigate(page,place)
                board_and_invite(page)
                configure(page,{'price':'fair','fees':'fair','risk':'fair'},{'rights':'document','harmony':'training','prevent':'targeted','resolve':'mediate'})
                crisis(page)
                check('Isolated standalone full offline UI route reaches A',page.evaluate("state.result==='A'"))
                page.click('#quizBtn');check('Standalone quiz interactive',page.locator('[name=quizAnswer]').count()==4);page.click('#learningClose')
                page.screenshot(path=str(SHOTS/'standalone-offline-ending.png'),full_page=True)
            # Reload on file:// checks real persistence for this browser and path.
            saved_scene=page.evaluate('scene')
            page.reload();page.click('#resumeBtn')
            check('Offline '+name+' file storage resumes',page.evaluate("state.found.field.includes('field_buyer')") and page.evaluate("scene")==saved_scene)
            page.context.close()
    scenario('Cold offline packaging and asset decode',offline_assets)

    def keyboard_and_css():
        for width,height in [(1920,1080),(1366,768),(1280,720),(390,844)]:
            page=new_page(width,height,reduced=True)
            check(f'Home fits {width}×{height}',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            page.click('#knowledgeBtn')
            page.focus('#learningClose');page.keyboard.press('Tab')
            check(f'Native dialog contains focus {width}',page.evaluate("document.getElementById('learningDialog').contains(document.activeElement)"))
            page.keyboard.press('Escape');page.focus('#startBtn');page.keyboard.press('Space')
            check(f'Space activates button {width}',page.locator('#story.active').count()==1)
            check(f'Reduced motion text remains complete {width}',page.locator('#storyText').inner_text()==page.evaluate('activeStory().text'))
            check(f'CSS focus outline {width}',page.evaluate("getComputedStyle(document.activeElement).outlineStyle!=='none'"))
            check(f'HTML no duplicate IDs {width}',page.evaluate("(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return new Set(ids).size===ids.length;})()"))
            page.context.close()
    scenario('Viewports, keyboard and reduced motion',keyboard_and_css)

    check('No uncaught JavaScript exceptions',not all_errors,json.dumps(all_errors,ensure_ascii=False))
    check('No missing/failed runtime assets',not all_failed,json.dumps(all_failed,ensure_ascii=False)[:1000])
    browser.close()
server.shutdown()
(ART/'browser.json').write_text(json.dumps({'browser':'local Chromium/Edge via Playwright','errors':all_errors,'failedRequests':all_failed,'cancelledRequests':cancelled_requests,'tests':results},ensure_ascii=False,indent=2))
passes=sum(r['status']=='PASS' for r in results)
print(f'{passes}/{len(results)} PASS; {len(results)-passes} FAIL')
sys.exit(0 if passes==len(results) else 1)
