"""Dependency-free public-site integrity and preserved-contract checks."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import subprocess
import sys
import json

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids=[]; self.refs=[]; self.forms=[]; self.hidden=[]; self.controls=[]
        self.h1=0; self.images=[]; self.text=[]; self.skip=0
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag in ('script','style'): self.skip+=1
        if a.get('id'): self.ids.append(a['id'])
        if tag=='h1': self.h1+=1
        for key in ('href','src'):
            if key in a: self.refs.append((tag,key,a[key]))
        if tag=='img': self.images.append(a)
        if tag=='form': self.forms.append((a.get('action'),a.get('method','GET').upper()))
        if tag=='input' and a.get('type')=='hidden': self.hidden.append((a.get('name'),a.get('value')))
        if tag in ('input','select','textarea'): self.controls.append((tag,a.get('name'),a.get('type'), 'required' in a))

    def handle_endtag(self, tag):
        if tag in ('script','style'): self.skip-=1

    def handle_data(self, data):
        if not self.skip and data.strip(): self.text.append(' '.join(data.split()))

paths=[p for p in ROOT.rglob('*.html') if '.git' not in p.parts]
pages={p:Page(p.read_text(encoding='utf-8')) for p in paths}
errors=[]; comparisons=[]
for path,page in pages.items():
    name=path.relative_to(ROOT).as_posix()
    if path.name!='admin.html' and page.h1!=1: errors.append(f'{name}: expected one h1, got {page.h1}')
    for id,count in Counter(page.ids).items():
        if count>1: errors.append(f'{name}: duplicate id {id}')
    if any('alt' not in image for image in page.images): errors.append(f'{name}: image missing alt')
    for tag,key,ref in page.refs:
        url=urlsplit(ref)
        if url.scheme or url.netloc or not ref: continue
        target=(ROOT/url.path.lstrip('/') if url.path.startswith('/') else path.parent/unquote(url.path)).resolve() if url.path else path
        if target.is_dir(): target=target/'index.html'
        if not target.exists(): errors.append(f'{name}: missing local target {ref}'); continue
        if url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{name}: missing anchor {ref}')
    if path.name!='admin.html' and not any('premium.css' in ref for _,_,ref in page.refs): errors.append(f'{name}: missing shared theme')
    baseline=subprocess.run(['git','show',f'HEAD:{name}'],cwd=ROOT,capture_output=True)
    if baseline.returncode: continue
    before=Page(baseline.stdout.decode('utf-8'))
    if before.forms:
        if before.forms!=page.forms: errors.append(f'{name}: form destination changed')
        if before.hidden!=page.hidden: errors.append(f'{name}: hidden form contract changed')
        if before.controls!=page.controls: errors.append(f'{name}: named field/required contract changed')
        comparisons.append(name+': form contract preserved')
    if path.name in ('privacidade.html','cookies.html','aviso-legal.html'):
        if before.text!=page.text: errors.append(f'{name}: legal text changed')
        comparisons.append(name+': legal text preserved')

result={'pages':len(pages),'localLinksAndAssets':'pass' if not errors else 'fail','preservedContracts':comparisons,'errors':errors}
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(bool(errors))
