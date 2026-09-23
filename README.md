# lumisland-site

Site institucional da Lumisland, publicado em `https://lumisland.pt/` pelo GitHub
Pages a partir da raiz da branch `main`. A configuração foi confirmada na API do
GitHub em 23 de setembro de 2026. A publicação ocorre após push autorizado.

## Pré-visualização e verificação

O site continua estático, sem dependências de frontend ou etapa de build.

```powershell
python scripts/preview.py
```

Abrir `http://127.0.0.1:4174/`. O servidor liga apenas à máquina local e não guarda
cache dos ficheiros durante a revisão. `?qa-form=1` substitui o destino do formulário
por um recetor local que não guarda dados nem envia e-mails. `?qa-nojs=1` permite
verificar o conteúdo sem scripts. Estes modos existem apenas no servidor local.

```powershell
python scripts/check_site.py
node --check js/app.js
node --check js/sculpture.js
```

A identidade partilhada está em `css/premium.css`, documentada em `DESIGN.md`.
`QA.md` regista a verificação da repaginação de setembro de 2026.

## Estrutura

- `index.html` — página principal
- `css/styles.css` — estilos
- `js/app.js` — interações e estado de envio do formulário
- `js/analytics.js` — consentimento e eventos de conversão
- `assets/icons/favicon.svg` — favicon
- `404.html` — página de erro
- `robots.txt` e `sitemap.xml` — SEO básico
- `_headers` — cabeçalhos de segurança e cache para Cloudflare Pages

## Publicação no Cloudflare Pages

- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `/` ou diretório raiz

O formulário é enviado pelo FormSubmit para `contacto@lumisland.pt` e redireciona
para `obrigado.html`. A medição regista os principais passos do funil sem guardar
nome, e-mail, telefone ou mensagem nos eventos:

- clique em chamada para contacto;
- início e envio válido do formulário;
- lead confirmado na página de obrigado;
- clique no endereço de e-mail.

O evento `generate_lead` só é emitido após um envio iniciado no formulário e é
protegido contra duplicação por atualização da página.
