"""Optional axe-core WCAG automated audit; axe is a QA dependency only.
Set VCX_AXE to a local axe.min.js (e.g. npm install --prefix /tmp/vcx-qa axe-core).
"""
from pathlib import Path
import os
import json
import sys
from playwright.sync_api import sync_playwright
from browser_support import launch_browser
ROOT=Path(__file__).resolve().parent.parent
axe=Path(os.environ.get('VCX_AXE','/tmp/vcx-qa/node_modules/axe-core/axe.min.js'))
ART=ROOT/'artifacts/qa'
if not axe.is_file():
    (ART/'accessibility.json').write_text(json.dumps({'tests':[{'name':'axe WCAG audit','status':'BLOCKED','details':'Set VCX_AXE to local axe.min.js'}]}))
    print('BLOCKED: axe-core not installed. Set VCX_AXE.');sys.exit(2)
fixture=json.loads((ART/'simulation.json').read_text())['examples']['A']
results=[]
with sync_playwright() as p:
    browser=launch_browser(p)
    for width in [1366,390]:
        page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
        page.goto((ROOT/'index.html').as_uri());page.add_script_tag(path=str(axe))
        page.evaluate('(s)=>{window.auditFixture=s}',fixture)
        scenarios={
          'home':None,
          'journal':"openJournal()",
          'story':"closeJournal();begin()",
          'map':"renderWorld();show('world')",
          'explore':"enterPlace('coop')",
          'evidence':"openClue('coop_fees')",
          'board':"closeClue();renderBoard();show('board')",
          'invite':"renderInvitations();show('invite')",
          'hall':"state=VCXSim.migrate(auditFixture,initialState(),VCX_DATA);state.result=null;renderHall();show('hall')",
          'crisis':"openCrisis()",
          'ending':"$('crisisModal').classList.remove('show');state.crisis='prepared';state.result=evaluate().result;renderEnding();show('ending')",
          'knowledge':"openKnowledge('coop_fees')",
          'dashboard':"$('learningDialog').close();openDashboard()",
          'debate':"$('learningDialog').close();renderHall();show('hall');openDebate()",
          'quiz':"$('learningDialog').close();state.result='A';openQuiz()",
        }
        for name,action in scenarios.items():
            if action:page.evaluate(action)
            page.wait_for_timeout(350)
            raw=page.evaluate("async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})")
            violations=raw['violations']
            item={'name':f'axe {name} {width}px','status':'FAIL' if violations else 'PASS','violations':violations,'incomplete':[{'id':v['id'],'nodes':len(v['nodes'])} for v in raw['incomplete']]}
            results.append(item);print(item['status'],item['name'],[(v['id'],[n['target'] for n in v['nodes']]) for v in violations],flush=True)
        page.close()
    browser.close()
(ART/'accessibility.json').write_text(json.dumps({'tests':results},ensure_ascii=False,indent=2))
sys.exit(1 if any(r['status']=='FAIL' for r in results) else 0)
