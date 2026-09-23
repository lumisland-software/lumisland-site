"""Local-only preview with fresh assets and a no-send form test mode.

python scripts/preview.py
Visit /?qa-form=1 to send a synthetic form to the local test sink, never FormSubmit.
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
import os

ROOT = Path(__file__).resolve().parent.parent

class Preview(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        parts = urlsplit(self.path)
        if any(part.startswith('.') for part in parts.path.split('/') if part):
            self.send_error(404)
            return
        query = parse_qs(parts.query)
        if query.get('qa-form') == ['1'] or query.get('qa-nojs') == ['1']:
            path = (ROOT / parts.path.lstrip('/')).resolve()
            if path.is_dir(): path = path / 'index.html'
            if not path.is_relative_to(ROOT) or not path.is_file() or path.suffix != '.html':
                self.send_error(404)
                return
            html = path.read_text(encoding='utf-8').replace('action="https://formsubmit.co/contacto@lumisland.pt"', 'action="/__qa__/submitted"')
            if query.get('qa-nojs') == ['1']:
                import re
                html = re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.S)
            data = html.encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        # Avoid conditional requests while refining assets locally.
        if 'If-Modified-Since' in self.headers: del self.headers['If-Modified-Since']
        super().do_GET()

    def do_POST(self):
        if self.path != '/__qa__/submitted':
            self.send_error(405)
            return
        self.rfile.read(int(self.headers.get('Content-Length', '0')))
        data = '<!doctype html><html lang="pt-PT"><meta charset="utf-8"><title>Teste local concluído</title><h1>Pedido de teste recebido localmente.</h1><p>Nenhum e-mail foi enviado. Os dados não foram guardados.</p><a href="/?qa-form=1">Voltar ao formulário de teste</a></html>'.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

if __name__ == '__main__':
    os.chdir(ROOT)
    print('Preview: http://127.0.0.1:4174', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4174), Preview).serve_forever()
