function preencherProduto(el){
    const produto = el.getAttribute('data-product');
    const select = document.getElementById('produto');
    if(select){ select.value = produto; }
  }

  function enviarContato(e){
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const empresa = document.getElementById('empresa').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const produto = document.getElementById('produto').value;
    const mensagem = document.getElementById('mensagem').value;

    const subject = encodeURIComponent(`Contato via site — ${nome}`);
    const body = encodeURIComponent(
      `Nome: ${nome}\n` +
      `Empresa: ${empresa || '-'}\n` +
      `E-mail: ${email}\n` +
      `Telefone: ${telefone || '-'}\n` +
      `Produto de interesse: ${produto}\n\n` +
      `Mensagem:\n${mensagem || '-'}`
    );
    window.location.href = `mailto:contato.lumisland@gmail.com?subject=${subject}&body=${body}`;
  }

  // Close mobile nav after clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      const toggle = document.getElementById('nav-toggle');
      if(toggle) toggle.checked = false;
    });
  });
