"""Build a self-contained offline HTML from the maintained external source.
No ZIPs are opened. Deterministic output; no changes to primary source files.
"""
import base64
import hashlib
import json
import mimetypes
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'dist' / 'Vung_Con_Xanh_v8_0_Offline.html'
ASSET = re.compile(r'(?:\.\./)?assets/[\w/.-]+')
embedded = {}

def inline_assets(text):
    def replace(match):
        rel = match[0].removeprefix('../')
        path = ROOT / rel
        if not path.is_file():
            raise FileNotFoundError(rel)
        data = path.read_bytes()
        mime = {'.ogg':'audio/ogg','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg'}.get(path.suffix.lower()) or mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
        embedded[rel] = hashlib.sha256(data).hexdigest()
        return 'data:' + mime + ';base64,' + base64.b64encode(data).decode('ascii')
    return ASSET.sub(replace, text)

def build():
    html = inline_assets((ROOT / 'index.html').read_text(encoding='utf-8'))
    def css(match):
        path = ROOT / match[1]
        return '<style>\n' + inline_assets(path.read_text(encoding='utf-8')) + '\n</style>'
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
    def script(match):
        source = inline_assets((ROOT / match[1]).read_text(encoding='utf-8'))
        # End-tag escaping is required even inside JavaScript string literals.
        source = source.replace('</script', '<\\/script')
        return '<script>\n' + source + '\n</script>'
    html = re.sub(r'<script src="([^"]+)" defer></script>', script, html)
    if re.search(r'(?:src|href)="(?:assets/|scripts/|styles/|https?://)', html):
        raise ValueError('Unresolved runtime dependency')
    OUTPUT.parent.mkdir(exist_ok=True)
    OUTPUT.write_text(html, encoding='utf-8')
    manifest = {'output': str(OUTPUT.relative_to(ROOT)), 'bytes': OUTPUT.stat().st_size,
                'sha256': hashlib.sha256(OUTPUT.read_bytes()).hexdigest(), 'assets': embedded}
    (OUTPUT.parent / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Built {OUTPUT.relative_to(ROOT)} ({manifest["bytes"]:,} bytes), {len(embedded)} unique assets')

if __name__ == '__main__':
    build()
