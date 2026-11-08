"""Validate that all original non-Git inputs were copied byte-for-byte."""
import hashlib, json, sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'docs/CONTENT_INTEGRITY.json').read_text('utf-8'))
missing=[];mismatch=[]
for rel,expected in manifest['files'].items():
 f=root/rel
 if not f.exists():missing.append(rel);continue
 h=hashlib.sha256(f.read_bytes()).hexdigest()
 if h!=expected:mismatch.append(rel)
print('Original source files:',len(manifest['files']))
print('Missing:',len(missing),'Changed:',len(mismatch))
if missing:print(missing[:10])
if mismatch:print(mismatch[:10])
assert not missing and not mismatch
assert (root/'index.html').exists()
assert not list(root.rglob('.git')),'nested Git repositories should not be packaged'
print('PASS all source files remain byte-for-byte intact')
