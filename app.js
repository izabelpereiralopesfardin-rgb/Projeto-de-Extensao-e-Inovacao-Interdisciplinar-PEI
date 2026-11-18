(() => {
  'use strict';
  const config = window.MORAES_CONFIG || {};
  const whatsapp = String(config.whatsapp || '').replace(/\D/g, '');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Aviso curto no rodapé da tela.
  const toastElement = $('#toast');
  let toastTimer;
  function toast(text) {
    toastElement.textContent = text;
    toastElement.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastElement.classList.remove('is-visible'), 2600);
  }

  // Abre a conversa no WhatsApp da oficina com a mensagem pronta.
  function send(message) {
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  }

  // Menu do celular.
  const navToggle = $('.menu-toggle');
  const nav = $('#main-nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); navToggle.focus(); }
  });
  document.addEventListener('click', event => {
    if (nav.classList.contains('is-open') && !event.target.closest('.site-header')) setMenu(false);
  });

  // Mensagem de erro ou dica embaixo de cada formulário.
  function hint(element, text, isError) {
    if (!element.dataset.original) element.dataset.original = element.innerHTML;
    if (text) element.textContent = text;
    else element.innerHTML = element.dataset.original;
    element.classList.toggle('is-error', Boolean(isError));
  }

  const numero = value => new Intl.NumberFormat('pt-BR').format(value);
  const data = date => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  function somaMeses(date, meses) {
    const alvo = new Date(date.getFullYear(), date.getMonth() + meses, 1);
    const ultimoDia = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
    alvo.setDate(Math.min(date.getDate(), ultimoDia));
    return alvo;
  }

  // Pedido de orçamento (ordem de serviço).
  const osForm = $('#form-os');
  const osHint = $('#os-hint');
  osForm.addEventListener('submit', event => {
    event.preventDefault();
    const nome = osForm.elements.nome;
    const carro = osForm.elements.carro;
    const relato = osForm.elements.relato.value.trim();
    const servicos = $$('input[name="servico"]:checked', osForm).map(input => input.value);
    const vazios = [nome, carro].filter(field => !field.value.trim());
    [nome, carro].forEach(field => field.setAttribute('aria-invalid', String(vazios.includes(field))));
    if (vazios.length) {
      hint(osHint, 'Preencha o seu nome e o carro com o ano.', true);
      vazios[0].focus();
      return;
    }
    if (!servicos.length && !relato) {
      hint(osHint, 'Marque um serviço ou conte o que o carro está fazendo.', true);
      $('input[name="servico"]', osForm).focus();
      return;
    }
    hint(osHint, '', false);
    const linhas = [`Olá! Sou ${nome.value.trim()} e quero um orçamento para o meu ${carro.value.trim()}.`];
    if (servicos.length) linhas.push(`Serviços: ${servicos.join(', ').toLowerCase()}.`);
    if (relato) linhas.push(`O que está acontecendo: ${relato}`);
    send(linhas.join('\n'));
  });
  osForm.addEventListener('input', event => {
    if (event.target.value && event.target.value.trim()) event.target.removeAttribute('aria-invalid');
    if (osHint.classList.contains('is-error')) hint(osHint, '', false);
  });

  // Links que levam ao orçamento: marca o serviço e põe o cursor no nome.
  function irParaOrcamento() {
    setTimeout(() => osForm.elements.nome.focus({ preventScroll: true }), reduceMotion.matches ? 0 : 500);
  }
  $$('[data-servico]').forEach(link => link.addEventListener('click', () => {
    const servico = link.dataset.servico;
    const input = $$('input[name="servico"]', osForm).find(item => item.value === servico);
    if (input && !input.checked) {
      input.checked = true;
      toast(`${servico} marcado no pedido de orçamento`);
    }
    irParaOrcamento();
  }));
  $$('[data-focus-orcamento]').forEach(link => link.addEventListener('click', irParaOrcamento));

  // Preço de pneu pela medida.
  const pneuForm = $('#form-pneu');
  const pneuHint = $('#pneu-hint');
  pneuForm.addEventListener('submit', event => {
    event.preventDefault();
    const campo = pneuForm.elements.medida;
    const medida = campo.value.trim().match(/(\d{3})\s*\/\s*(\d{2})\s*(?:Z?R)?\s*(\d{2})/i);
    if (!medida) {
      campo.setAttribute('aria-invalid', 'true');
      hint(pneuHint, 'Escreva a medida como aparece no pneu, por exemplo 175/70 R14.', true);
      campo.focus();
      return;
    }
    campo.removeAttribute('aria-invalid');
    hint(pneuHint, '', false);
    const texto = `${medida[1]}/${medida[2]} R${medida[3]}`;
    const quantidade = Number(pneuForm.elements.quantidade.value);
    send(`Olá! Quero o preço de ${quantidade} ${quantidade > 1 ? 'pneus' : 'pneu'} ${texto}.`);
  });
  pneuForm.elements.medida.addEventListener('input', () => {
    pneuForm.elements.medida.removeAttribute('aria-invalid');
    if (pneuHint.classList.contains('is-error')) hint(pneuHint, '', false);
  });

  // Etiqueta de troca de óleo.
  const oleos = {
    mineral: { nome: 'Mineral', km: 5000, meses: 6 },
    semissintetico: { nome: 'Semissintético', km: 7500, meses: 6 },
    sintetico: { nome: 'Sintético', km: 10000, meses: 12 },
  };
  const oleoForm = $('#form-oleo');
  const oleoHint = $('#oleo-hint');
  const resumo = $('#oleo-resumo');
  const etiqueta = $('#etiqueta');
  const campoEtiqueta = name => $(`[data-etiqueta="${name}"]`, etiqueta);
  const kmCampo = oleoForm.elements.km;

  function leituraOleo() {
    const km = Number(kmCampo.value.replace(/\D/g, ''));
    const oleo = oleos[oleoForm.elements.tipo.value] || oleos.sintetico;
    const pesado = oleoForm.elements.pesado.checked;
    const intervaloKm = pesado ? oleo.km / 2 : oleo.km;
    const meses = pesado ? oleo.meses / 2 : oleo.meses;
    const hoje = new Date();
    return { km, oleo, pesado, proximoKm: km + intervaloKm, proximaData: somaMeses(hoje, meses), hoje };
  }

  let carimboTimer;
  function atualizaEtiqueta() {
    const leitura = leituraOleo();
    campoEtiqueta('oleo').textContent = leitura.oleo.nome;
    if (!leitura.km) {
      campoEtiqueta('data').textContent = '__/__/____';
      campoEtiqueta('km').textContent = '________';
      campoEtiqueta('proxkm').textContent = '________ km';
      campoEtiqueta('proxdata').textContent = '__/__/____';
      resumo.textContent = 'Preencha a quilometragem para ver a próxima troca.';
      return;
    }
    campoEtiqueta('data').textContent = data(leitura.hoje);
    campoEtiqueta('km').textContent = numero(leitura.km);
    campoEtiqueta('proxkm').textContent = `${numero(leitura.proximoKm)} km`;
    campoEtiqueta('proxdata').textContent = data(leitura.proximaData);
    resumo.textContent = `Próxima troca com ${numero(leitura.proximoKm)} km ou em ${data(leitura.proximaData)}, o que vier primeiro.`;
    if (!reduceMotion.matches) {
      clearTimeout(carimboTimer);
      carimboTimer = setTimeout(() => {
        etiqueta.classList.remove('is-carimbo');
        void etiqueta.offsetWidth;
        etiqueta.classList.add('is-carimbo');
      }, 350);
    }
  }

  kmCampo.addEventListener('input', () => {
    const digitos = kmCampo.value.replace(/\D/g, '').slice(0, 7);
    kmCampo.value = digitos ? numero(Number(digitos)) : '';
    kmCampo.removeAttribute('aria-invalid');
    if (oleoHint.classList.contains('is-error')) hint(oleoHint, '', false);
    atualizaEtiqueta();
  });
  oleoForm.addEventListener('change', event => { if (event.target !== kmCampo) atualizaEtiqueta(); });
  oleoForm.addEventListener('submit', event => {
    event.preventDefault();
    const leitura = leituraOleo();
    if (!leitura.km) {
      kmCampo.setAttribute('aria-invalid', 'true');
      hint(oleoHint, 'Informe a quilometragem que aparece no painel do carro.', true);
      kmCampo.focus();
      return;
    }
    hint(oleoHint, '', false);
    let mensagem = `Olá! Quero agendar a troca de óleo. Meu carro está com ${numero(leitura.km)} km e usa óleo ${leitura.oleo.nome.toLowerCase()}.`;
    if (leitura.pesado) mensagem += ' O uso é pesado (aplicativo, trânsito ou estrada de terra).';
    send(mensagem);
  });
  atualizaEtiqueta();
})();
