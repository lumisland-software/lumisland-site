# lumisland-site

Site institucional da Lumisland, preparado para publicação no Cloudflare Pages.

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
