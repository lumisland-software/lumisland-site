"""Canonical inventory of public copy; excludes security metadata and form values."""
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import urlsplit, parse_qs

ROOT = Path(__file__).resolve().parent.parent
LOCALES = ('en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT')
DYNAMIC_COPY = [
    'Abrir menu', 'Fechar menu', 'Idioma', 'A carregar idioma…',
    'Não foi possível mudar o idioma. Tente novamente.',
    'Confirme que leu a política para enviar o pedido.',
    'Preencha este campo para continuar.',
    'Indique um endereço de e-mail válido, como nome@empresa.pt.',
    'Verifique os campos assinalados. Os seus dados foram mantidos.',
    'A encaminhar o pedido para envio…', 'A enviar…',
    '▷ Retomar animação', 'Ⅱ Pausar animação',
]
ATTRS = ('aria-label', 'title', 'placeholder', 'alt')
META = ('description', 'og:title', 'og:description', 'twitter:title', 'twitter:description')
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

def normalize(value):
    return ' '.join(value.split())

def translatable(value):
    return bool(re.search(r'[A-Za-zÀ-ÿ]{2}', value)) and not re.fullmatch(r'(?:https?://|mailto:|www\.).*|[^\s]+@[^\s]+|[\w.-]+\.(?:pt|com|svg|png|xlsx)', value)

class Copy(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.strings = set()
        self.feed(text)

    def add(self, value):
        value = normalize(value)
        if translatable(value): self.strings.add(value)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        skipped = bool(self.stack and self.stack[-1][1]) or tag in ('script','style','noscript') or a.get('translate') == 'no'
        if not skipped:
            for key in ATTRS:
                if a.get(key): self.add(a[key])
            if tag == 'meta' and (a.get('name') or a.get('property')) in META:
                self.add(a.get('content',''))
            if tag == 'a' and a.get('href'):
                url = urlsplit(a['href'])
                query = parse_qs(url.query)
                field = 'text' if url.hostname == 'wa.me' else 'subject' if url.scheme == 'mailto' else None
                if field and field in query: self.add(query[field][0])
        if tag not in VOID: self.stack.append((tag, skipped))

    def handle_endtag(self, tag):
        for index in range(len(self.stack)-1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def handle_data(self, value):
        if not self.stack or not self.stack[-1][1]: self.add(value)

def pages():
    return sorted(p for p in ROOT.rglob('*.html') if '.git' not in p.parts and p.name != 'admin.html')

def inventory():
    result = set(DYNAMIC_COPY)
    for path in pages(): result.update(Copy(path.read_text(encoding='utf-8')).strings)
    return sorted(result)

if __name__ == '__main__':
    import json, sys
    sys.stdout.reconfigure(encoding='utf-8')
    print(json.dumps(inventory(), ensure_ascii=False, indent=2))
