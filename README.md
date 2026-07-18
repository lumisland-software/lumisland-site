# lumisland-site

Site institucional da Lumisland, preparado para publicação no Cloudflare Pages.

## Estrutura

- `index.html` — página principal
- `css/styles.css` — estilos
- `js/app.js` — interações e formulário por e-mail
- `assets/icons/favicon.svg` — favicon
- `404.html` — página de erro
- `robots.txt` e `sitemap.xml` — SEO básico
- `_headers` — cabeçalhos de segurança e cache para Cloudflare Pages

## Publicação no Cloudflare Pages

- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `/` ou diretório raiz

O formulário abre o cliente de e-mail do visitante e envia para `michael.claro@lumisland.pt`.
