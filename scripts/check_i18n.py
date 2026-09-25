"""Release guard for complete catalogs, page coverage and preserved numeric facts."""
import json
from collections import Counter
import re
import sys
from i18n_source import ROOT, LOCALES, inventory, pages
from review_locale_copy import COPY

sys.stdout.reconfigure(encoding='utf-8')

sources = inventory()
errors = []
reports = []
for locale in LOCALES:
    data = json.loads((ROOT/'locales'/f'{locale}.json').read_text(encoding='utf-8'))
    missing = set(sources)-data.keys()
    if missing: errors.append(f'{locale}: missing {sorted(missing)}')
    for source in sources:
        value = data.get(source, '')
        if not value.strip() or re.search(r'ZXQ|\[L\d{4}\]',value): errors.append(f'{locale}: invalid translation for {source}')
        if Counter(re.findall(r'\d+',source)) != Counter(re.findall(r'\d+',value)):
            errors.append(f'{locale}: numeric facts changed: {source} => {value}')
    for source,values in COPY.items():
        if source in sources and data.get(source)!=values[LOCALES.index(locale)]:
            errors.append(f'{locale}: reviewed term drifted: {source}')
    reports.append({'locale':locale,'translated':len(set(sources)&data.keys()),'total':len(sources)})
for path in pages():
    text=path.read_text(encoding='utf-8')
    if text.count('/js/i18n.js?') != 1 or '/css/i18n.css?' not in text: errors.append(f'{path}: shared locale owner missing')
    if '<script src="../js/tvde-i18n.js' in text: errors.append(f'{path}: legacy locale owner still active')

print(json.dumps({'publicPages':len(pages()),'catalogs':reports,'errors':errors},ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
