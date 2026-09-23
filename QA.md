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
