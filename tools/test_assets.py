"""Offline asset/source integrity. Does not open archives or rebuild artwork."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import hashlib
import json
import re
import subprocess
import sys

ROOT=Path(__file__).resolve().parent.parent
results=[]
def check(name,value,details=''):
    results.append({'name':name,'status':'PASS' if value else 'FAIL','details':details})
    print(results[-1]['status'],name,details)

class Parser(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.refs=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if 'id' in attrs:self.ids.append(attrs['id'])
        for k in ['href','src']:
            if k in attrs:self.refs.append(attrs[k])

html=(ROOT/'index.html').read_text();parser=Parser();parser.feed(html)
try:
    import html5lib
    html_parser=html5lib.HTMLParser();html_parser.parse(html)
    check('HTML5 parser reports no errors',not html_parser.errors,str(html_parser.errors))
except ImportError:
    results.append({'name':'HTML5 parser','status':'BLOCKED','details':'Use --with html5lib'})
check('HTML IDs are unique',len(parser.ids)==len(set(parser.ids)))
check('HTML local dependencies exist',all((ROOT/p).is_file() for p in parser.refs if not p.startswith(('#','data:'))))
files=list((ROOT/'scripts').rglob('*.js'))+[ROOT/'styles/game.css',ROOT/'index.html']
refs=set()
for p in files:refs.update(m.removeprefix('../') for m in re.findall(r'(?:\.\./)?assets/[\w/.-]+',p.read_text()))
missing=[p for p in refs if not (ROOT/p).is_file()]
check('All 58 runtime asset paths exist',len(refs)==58 and not missing,str(missing))
for p in (ROOT/'scripts').rglob('*.js'):
    proc=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
    check('JavaScript syntax '+p.name,proc.returncode==0,proc.stderr)
check('No remote runtime dependencies',not any(re.search(r'(?:https?:)?//[^\s]+\.(?:js|css|png|jpg|ogg)|@import|fonts.googleapis|fetch\(|XMLHttpRequest|WebSocket',p.read_text()) for p in files))
check('40 portraits and four sprites retained',len(list((ROOT/'assets/portrait').glob('*.png')))==40 and len(list((ROOT/'assets/sprites').glob('*.png')))==4)
check('Nine OGG files have valid magic',all(p.read_bytes().startswith(b'OggS') for p in (ROOT/'assets/audio').rglob('*.ogg')) and len(list((ROOT/'assets/audio').rglob('*.ogg')))==9)
before=ROOT/'artifacts/qa/assets-before.json'
if before.exists():
    manifest=json.loads(before.read_text())
    changed=[p for p,h in manifest.items() if not (ROOT/p).is_file() or hashlib.sha256((ROOT/p).read_bytes()).hexdigest()!=h]
    check('All 118 original assets byte-for-byte unchanged',len(manifest)==118 and not changed,str(changed))
release=ROOT/'dist/Vung_Con_Xanh_v8_0_Offline.html'
if release.is_file():
    packed=release.read_text()
    check('Standalone OGG MIME is deterministic',packed.count('data:audio/ogg;base64,')>=9 and 'data:application/octet-stream' not in packed)
# Strict CSS parser provided only to dev QA; never part of the game.
try:
    import tinycss2
    css_errors=[]
    def inspect(nodes):
        for node in nodes:
            if node.type=='error':css_errors.append(str(node))
            if node.type=='qualified-rule':
                for decl in tinycss2.parse_declaration_list(node.content,skip_whitespace=True,skip_comments=True):
                    if decl.type=='error':css_errors.append(str(decl))
            elif node.type=='at-rule' and node.content and node.lower_at_keyword in ['media','supports','keyframes']:
                inspect(tinycss2.parse_rule_list(node.content,skip_whitespace=True,skip_comments=True))
    inspect(tinycss2.parse_stylesheet((ROOT/'styles/game.css').read_text(),skip_whitespace=True,skip_comments=True))
    check('CSS syntax parser',not css_errors,str(css_errors))
except ImportError:
    results.append({'name':'CSS syntax parser','status':'BLOCKED','details':'Use uv run --with tinycss2 python tools/test_assets.py'})
for p in [ROOT/'index.html',*(ROOT/'scripts').rglob('*.js')]:
    if p.name=='game-data.js':continue
    used=re.findall(r"""\$\(['"]([^'"]+)['"]\)""",p.read_text())
    dynamic={'priceSlider','miniResult','miniCheck','priceNum','sideSequence','contextKnowledge','demoExpand','knowledgeSelect','dashboardExport','dashboardQuiz','debateReset','submitDebate','debateResult','quizFeedback','quizPrev','quizNext','quizExport','debateConcept','debateProof','debateCause','debateResponse'}
    check('Static DOM references '+p.name,all(id in parser.ids or id in dynamic for id in used),str([id for id in used if id not in parser.ids and id not in dynamic]))
out=ROOT/'artifacts/qa/assets.json';out.write_text(json.dumps({'tests':results},ensure_ascii=False,indent=2));sys.exit(1 if any(r['status']=='FAIL' for r in results) else 0)
