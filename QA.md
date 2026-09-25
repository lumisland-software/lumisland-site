# Verificação da repaginação — 23 de setembro de 2026

## Âmbito e publicação

- Implementação local do site estático existente; sem alteração de infraestrutura,
  contas SaaS, bases de dados, autenticação ou destinos de inscrição dos produtos.
- Página inicial reconstruída: especialização full stack, galeria dos produtos,
  competências expansíveis, processo, fundador e contacto.
- Identidade partilhada aplicada às 11 páginas públicas; `admin.html` mantém o
  redirecionamento existente. Publicação em produção autorizada posteriormente
  pelo utilizador, após a apresentação da pré-visualização.
- CSS original e estilos de produto mantêm os contratos estruturais existentes;
  `premium.css`, carregado por último, define a nova linguagem visual.
- O site online foi observado no navegador antes da implementação. Na preparação
  da publicação, `git fetch origin main` confirmou divergência 0/0 entre a base
  local `c745177` e a remota. A API confirmou GitHub Pages a partir de `main:/`,
  domínio `lumisland.pt`, certificado aprovado e HTTPS obrigatório. O resultado
  efetivo da publicação e a inspeção online são comunicados na tarefa.

## Verificações executadas

- `python scripts/check_site.py`: 12 documentos, zero erros. Todos os destinos e
  recursos locais existem; âncoras internas resolvem; IDs únicos; um H1 por página
  pública; imagens com texto alternativo e tema partilhado presente.
- Contratos dos três formulários comparados com HEAD: destinos, método, campos
  ocultos, nomes e obrigatoriedade preservados.
- Texto visível de Privacidade, Cookies e Aviso Legal comparado com HEAD: igual.
- `node --check js/app.js` e `node --check js/sculpture.js`: aprovados.
- `git diff --check`: aprovado.
- Não existe pipeline de build nem suite de frontend anterior neste site estático.

## Navegador real

Pré-visualização em `http://127.0.0.1:4174/`, Codex In-app Browser:

- Inicial, Sobre, Websites, Áurea, Oficina e TVDE verificados a 1440px e 320px;
  todas as 11 páginas públicas verificadas a 390px. Inicial verificada também a
  820px. Sem deslocamento horizontal do documento nos estados finais verificados.
- Capturas e revisão visual de inicial, galeria, menu, erros do formulário,
  Sobre, Websites e páginas dos três produtos.
- Menu móvel abre/fecha, atualiza estado e nome acessível; Escape fecha e devolve
  foco. Navegação por âncoras respeita o cabeçalho fixo.
- Competência de desenvolvimento expande e a ação pré-seleciona Sistema de gestão
  no contacto. Seleção nativa de Automação e integrações verificada no telemóvel.
- Formulário vazio não navega; campos obrigatórios exibem erro associado e o
  primeiro recebe foco. E-mail inválido e consentimento em falta verificados.
- Os três formulários enviaram dados exclusivamente sintéticos ao recetor local
  `/__qa__/submitted`; resposta confirmada. Nenhum pedido real ao FormSubmit e
  nenhum e-mail enviado. A entrega externa continua dependente do serviço existente.
- Voltar após envio local preserva os campos e repõe o botão disponível.
- TVDE alterna PT/FR e volta a PT; destinos comerciais mantidos.
- Preferência de movimento reduzido ativa no navegador: a escultura inicia parada.
  Retomar/Pausar alternam corretamente e o desenho é renderizado. Código pausa
  também por visibilidade da página e interseção; estes dois mecanismos não foram
  medidos com um profiler.
- Sem JavaScript: escultura SVG carregada, navegação móvel visível, botão de
  animação oculto e validação nativa ativa. Conteúdo permanece acessível.
- Sem imagens quebradas nas páginas verificadas e sem erros JavaScript reportados
  pelo navegador na revisão final dos percursos.

## Auditor estático da skill

Comando executado: `python <frontend-design-premium>/scripts/audit_project.py .
--mode strict --output premium-audit.json`.

O auditor termina com código 1 e 16 ocorrências; **não é um relatório limpo**.
As ocorrências restantes são limitações da análise literal de HTML, verificadas
contra o código e os testes reais:

- 10 `affordance.actionless-button`: os nove menus usam `addEventListener` em
  `js/app.js`; o controlo da escultura usa `js/sculpture.js`. O auditor só reconhece
  handlers inline. Não se introduziram handlers inline para contornar a análise.
- 3 `form.novalidate-missing`: `app.js` define `form.noValidate = true` em execução
  e faz validação própria. O atributo não é colocado no HTML para preservar a
  validação nativa se JavaScript não carregar.
- 3 `form.textarea-resize-missing`: `resize: none` pertence a `.contact-form textarea`
  no CSS partilhado; os campos crescem através do handler de input. O auditor só
  inspeciona o atributo/class literal de cada textarea.

As três decisões de select nativo estão documentadas no manifesto. Dois botões
decorativos sem ação na prévia do TVDE foram convertidos em texto estilizado.
Não se afirma uma auditoria completa WCAG nem teste de entrega externa de e-mail.

## Repaginação das quatro soluções — 25/09/2026

- Rotas: `/aurea/`, `/oficina/`, `/tvde/` e `/criacao-de-sites/`, identificadas no
  menu Soluções de `/sobre/` publicado. Base: commit `4f1eced` de `main`.
- Apresentações próprias, nova composição de produto, secções interiores,
  recursos, planos e perguntas com o sistema partilhado em `css/solutions.css`.
- Inspeção visual no navegador: cabeçalhos e secções interiores em desktop
  1440×960 e telemóvel 390×844; cabeçalhos adicionais em 320×740. Verificação DOM
  das quatro rotas em 320, 820 e 1440px: um h1 por página, sem overflow horizontal,
  sem títulos/cartões/formulários com texto transbordante e sem imagens carregadas
  com erro. As imagens lazy ainda não carregadas não contam como verificadas.
- Menus móveis abrem e fecham com Escape; os quatro menus incluem as quatro
  soluções. Primeira pergunta de cada rota abre corretamente.
- TVDE usa select nativo: PT, EN, ES, FR, DE e IT mudam o título e a apresentação;
  seleção PT persiste após recarregar. Os seis catálogos foram comparados com HEAD
  e mantidos exatamente. Nomes de idiomas e marca respeitam `translate="no"`.
- Formulários Websites/Oficina: submissão vazia identifica respetivamente 4/5
  campos inválidos e foca o nome; preenchimento sintético chega ao recetor local
  `/__qa__/submitted`, sem envio externo nem armazenamento. Destinos, campos,
  consentimentos e contratos comerciais preservados.
- Websites sem JavaScript: menu visível e validação nativa disponível, sem
  overflow. Movimento reduzido mantém o conteúdo visível; CSS desativa animações
  e transições. Efeitos hover são melhorias opcionais para dispositivos com rato.
- `python scripts/check_site.py`: 12 páginas, referências e contratos preservados.
  `node --check` em app.js, sculpture.js e tvde-i18n.js: passou.
- Auditor estrito reexecutado: continuam as mesmas 16 ocorrências já explicadas
  acima (handlers externos, validação runtime e CSS partilhado). Não é um audit
  limpo; não surgiram novas categorias de ocorrência.
- Publicação em produção autorizada pelo pedido anterior “aplique no prd” e
  estendida pelo pedido de repaginar cada solução.

## Idiomas globais e mensagem da Áurea — 25/09/2026

- Um seletor nativo partilhado nas 11 páginas públicas, incluindo 404, obrigado,
  privacidade, cookies e aviso legal. `admin.html` mantém o redirecionamento.
- 917 textos inventariados em cada um dos cinco catálogos adicionais; português
  continua a ser a origem. O teste `scripts/check_i18n.py` exige cobertura integral,
  termos revistos e preservação dos números presentes no original.
- Rascunhos de tradução preparados durante a autoria a partir de texto público;
  termos de marcações, pagamentos, planos, navegação, dias da semana e primeiras
  mensagens foram revistos em `scripts/review_locale_copy.py`. As traduções são
  ficheiros locais; o browser não chama serviços de tradução. Não se trata de uma
  tradução jurídica certificada.
- Navegador a 390px: 11 rotas × EN/ES/FR/DE/IT (55 combinações), alteração de
  título/lang/seletor, persistência entre páginas e ausência de overflow da página.
  Em EN não ficaram frases portuguesas com mais de 35 caracteres no corpo das
  páginas. Uma palavra alemã da grelha e títulos 404 ES/FR exigiram ajuste CSS.
- Áurea revista em desktop e mobile: título explícito, experiência ilustrativa de
  marcação online e secção com os três passos. Pré-visualização não submete dados.
- Formulário de Websites: erros em EN, mudança para FR traduz erros já visíveis;
  nome/mensagem mantidos, menu abrir/fechar traduzido e envio sintético para o
  recetor local concluído. Nenhum pedido real enviado ao FormSubmit.
- Falha real de catálogo IT simulada apenas na prévia local: o seletor e o conteúdo
  permanecem em EN e mostram erro; restaurado o ficheiro, a nova tentativa muda
  para IT e limpa o erro. Nenhum catálogo esteve ausente em produção.
- Origem local sem consentimento anterior: banner muda para FR e o botão Refuser
  fecha o banner. O consentimento mantém o seu componente e comportamento originais.
- Valores dos formulários e metadados de segurança não pertencem ao inventário de
  tradução. Textos legais portugueses e contratos HTML comparados com HEAD.
- Verificação adicional a 320px em DE: home, quatro soluções e 404 sem overflow
  da página nem cortes nos títulos, navegação, ações ou passos da marcação.
  Cabeçalho DE confirmado a 1050px; Áurea PT/EN/FR confirmada a 1440px.
- Mudança para PT durante o carregamento inicial do idioma guardado cancela o
  pedido anterior e mantém seletor, conteúdo e atributo lang sincronizados.
- Auditor estrito: mantêm-se as 16 ocorrências conhecidas, sem novas categorias.
