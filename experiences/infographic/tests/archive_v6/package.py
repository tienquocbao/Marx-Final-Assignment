from pathlib import Path
import zipfile, tempfile, hashlib, os
root=Path(__file__).resolve().parents[1]
output=Path('/mnt/data/Vung_Con_Xanh_Green_Poster_Infographic_v6_FULL_REPO.zip')
files=sorted(f for f in root.rglob('*') if f.is_file() and '__pycache__' not in f.parts)
with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=7,allowZip64=True) as z:
    for file in files: z.write(file,arcname=f'{root.name}/{file.relative_to(root).as_posix()}')
with zipfile.ZipFile(output) as z:
    assert z.testzip() is None
    actual=[i.filename for i in z.infolist() if not i.is_dir()]
    assert len(files)==len(actual)
    for file in files:
        arc=f'{root.name}/{file.relative_to(root).as_posix()}'
        assert arc in actual
        assert hashlib.sha256(z.read(arc)).digest()==hashlib.sha256(file.read_bytes()).digest(),arc
with tempfile.TemporaryDirectory(prefix='vcx-infographic-v6-') as d:
    with zipfile.ZipFile(output) as z:z.extractall(d)
    extracted=Path(d)/root.name
    assert len([f for f in extracted.rglob('*') if f.is_file()])==len(files)
    for file in files:
        counterpart=extracted/file.relative_to(root)
        assert counterpart.is_file() and hashlib.sha256(file.read_bytes()).digest()==hashlib.sha256(counterpart.read_bytes()).digest()
print('OUTPUT',output)
print('SIZE',round(output.stat().st_size/(1024*1024),2),'MiB')
print('FILES',len(files))
print('ZIP CRC + SHA256 all files + extracted SHA256: PASS')
