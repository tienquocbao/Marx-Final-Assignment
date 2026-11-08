"""Release checks; exits nonzero on failures or blocked required suites.
uv run --with-requirements tools/requirements-qa.txt python tools/run_qa.py
"""
from pathlib import Path
import subprocess
import sys
import json
import re
ROOT=Path(__file__).resolve().parent.parent
ART=ROOT/'artifacts/qa';ART.mkdir(parents=True,exist_ok=True)
suites=[('build',[sys.executable,'tools/build_offline.py']),('assets',[sys.executable,'tools/test_assets.py']),('simulation',['node','tools/test_simulation.cjs']),('modules',['node','tools/test_modules.cjs']),('modular-browser',[sys.executable,'tools/test_modular_browser.py']),('legacy',[sys.executable,'tools/test_game_qa.py']),('browser',[sys.executable,'tools/test_v80.py']),('accessibility',[sys.executable,'tools/test_accessibility.py'])]
summary=[]
for name,cmd in suites:
    print('Running',name,flush=True)
    with (ART/(name+'.log')).open('w') as out:
        process=subprocess.run(cmd,cwd=ROOT,stdout=out,stderr=subprocess.STDOUT)
    status='PASS' if process.returncode==0 else 'BLOCKED' if process.returncode==2 else 'FAIL'
    summary.append({'suite':name,'status':status,'exitCode':process.returncode})
    print(status,name,flush=True)
    if name=='legacy':
        log=(ART/'legacy.log').read_text()
        matches=re.findall(r'^\[(PASS|FAIL)\] (.*?): (.*)$',log,re.MULTILINE)
        (ART/'legacy.json').write_text(json.dumps({'tests':[{'name':n,'status':s,'details':d} for s,n,d in matches]},ensure_ascii=False,indent=2))
(ART/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
print(json.dumps(summary,ensure_ascii=False))
sys.exit(1 if any(r['status']=='FAIL' for r in summary) else 2 if any(r['status']=='BLOCKED' for r in summary) else 0)
