"""Prepare static translation drafts from PUBLIC website copy, then review before release.

Only explicit --fetch invokes the Google public translation endpoint during authoring.
There is no translation service, user text transmission, or API credential at runtime.
Existing translations are reused, and successful batches are checkpointed locally.
"""
import argparse
from difflib import get_close_matches
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import re
import sys
import time
from urllib.parse import urlencode
from urllib.request import urlopen
from i18n_source import ROOT, LOCALES, inventory, normalize

INVARIANTS = {'Lumisland', 'Áurea', 'TVDE', 'Oficina', 'API', 'SEPA', 'Bolt', 'Uber',
              'PRIO', 'Via Verde', 'WhatsApp', 'Instagram', 'Studio Aurora', 'HTTPS',
              'Web design', 'Full stack', 'Browser Headless', 'PT · EN · ES · FR · DE · IT'}
TOKENS = {'Áurea': 'ZXQAUREAZXQ', 'Lumisland': 'ZXQLUMISLANDZXQ'}

def seed():
    legacy = (ROOT/'js/tvde-i18n.js').read_text(encoding='utf-8')
    return json.JSONDecoder().raw_decode(legacy.split('const catalog=',1)[1])[0]

def translate_batch(values, locale):
    lines = []
    for index, value in enumerate(values):
        for brand, token in TOKENS.items(): value = value.replace(brand, token)
        lines.append(f'[L{index:04d}] {value}')
    query = urlencode({'client':'gtx','sl':'pt','tl':locale[:2],'dt':'t','q':'\n'.join(lines)})
    for attempt in range(4):
        try:
            with urlopen('https://translate.googleapis.com/translate_a/single?'+query, timeout=40) as response:
                data = json.loads(response.read())
            translated = ''.join(part[0] or '' for part in data[0])
            matches = list(re.finditer(r'\[L\s*(\d{4})\]', translated, re.I))
            if len(matches) != len(values): raise ValueError('Translation markers changed')
            result = []
            for index, match in enumerate(matches):
                if int(match[1]) != index: raise ValueError('Translation order changed')
                value = translated[match.end():matches[index+1].start() if index+1<len(matches) else None].strip()
                for brand, token in TOKENS.items():
                    value = re.sub(token, brand, value, flags=re.I)
                for token in re.findall(r'ZXQ[A-Z]+ZXQ', value, re.I):
                    match_token = get_close_matches(token.upper(), TOKENS.values(), n=1, cutoff=.8)
                    if match_token:
                        brand = next(brand for brand, known in TOKENS.items() if known == match_token[0])
                        value = value.replace(token, brand)
                if not value or 'ZXQ' in value: raise ValueError('Incomplete translation: '+value)
                result.append(value)
            return result
        except Exception:
            if attempt == 3: raise
            time.sleep(2 ** attempt)

def generate(locale, sources, legacy):
    target = ROOT/'locales'/f'{locale}.json'
    existing = json.loads(target.read_text(encoding='utf-8')) if target.exists() else {}
    for source, value in zip(legacy['pt-PT'], legacy[locale]):
        if normalize(source) in sources: existing.setdefault(normalize(source), value)
    for value in INVARIANTS: 
        if value in sources: existing[value] = value
    missing = [value for value in sources if value not in existing]
    batches = []; batch = []; length = 0
    for value in missing:
        if batch and length+len(value)>1000: batches.append(batch);batch=[];length=0
        batch.append(value);length+=len(value)+10
    if batch: batches.append(batch)
    for index,batch in enumerate(batches):
        translations = translate_batch(batch,locale)
        existing.update(zip(batch,translations))
        target.write_text(json.dumps({k:existing[k] for k in sources if k in existing},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print(f'{locale}: {index+1}/{len(batches)} batches',flush=True)
    return locale,len(existing)

if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    parser=argparse.ArgumentParser();parser.add_argument('--fetch',action='store_true');args=parser.parse_args()
    if not args.fetch: parser.error('Use --fetch to prepare public-copy translation drafts.')
    sources=inventory();legacy=seed();(ROOT/'locales').mkdir(exist_ok=True)
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures=[pool.submit(generate,locale,sources,legacy) for locale in LOCALES]
        for future in futures: print('Complete:',future.result())
