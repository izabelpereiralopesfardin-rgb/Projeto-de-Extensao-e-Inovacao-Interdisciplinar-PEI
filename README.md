# Moraes Mecânica: landing page

Página de apresentação da Moraes Mecânica, oficina mecânica com balcão de peças e pneus no Jardim Limoeiro, Serra - ES. Feita em HTML, CSS e JavaScript, sem dependências nem etapa de compilação.

## Abrir

Abra `index.html` com dois cliques. Fotos e fontes ficam em `assets/`, então a página funciona sem internet.

Com Node.js instalado, rode `npm run dev` e abra http://127.0.0.1:4175 (a porta muda com a variável `PORT`).

## Publicar

`npm run build` copia para `dist/` só a página, os estilos, os scripts e os assets. A Vercel usa `vercel.json` para publicar essa pasta. Documentação e arquivos de configuração não vão para o site.

Depois de publicar, acrescente no `<head>` do `index.html` o endereço definitivo, para a prévia aparecer certa no WhatsApp:

```html
<meta property="og:url" content="https://ENDERECO-DO-SITE/">
<meta property="og:image" content="https://ENDERECO-DO-SITE/assets/og-image.jpg">
```

## Configurar (site.config.js)

- `whatsapp`: país + DDD + número, só dígitos (ex.: `5527999998888`). Com o número preenchido, todos os botões abrem a conversa já com a mensagem pronta (link `wa.me`). Vazio, a página mostra a mensagem numa janela para copiar e indica o telefone fixo. Hoje está vazio: o cadastro da empresa só traz o fixo (27) 3328-1611.

## O que tem na página

1. Abertura com a foto real do galpão, endereço e horário, e os botões "Pedir orçamento" e "Ligar".
2. Serviços organizados pelo sintoma (freios, suspensão e direção, motor, embreagem e câmbio, revisão, arrefecimento, óleo e filtros, pneus). O link de cada card marca o serviço no pedido de orçamento.
3. Peças e pneus: balcão de peças, guia para ler a medida na lateral do pneu e pedido de preço pela medida.
4. Troca de óleo: a pessoa informa a quilometragem e o tipo de óleo, e a etiqueta de para-brisa mostra a próxima troca (km e data). Uso pesado corta o intervalo pela metade.
5. Orçamento: como funciona o atendimento, em quatro passos, e o formulário em forma de ordem de serviço.
6. Onde fica: foto da fachada, endereço, Google Maps, Waze, telefone e horário.
7. Rodapé com razão social, nome fantasia, CNPJ e o crédito "Desenvolvido por grupo de alunos Multivix PEI2".

No celular aparece uma barra fixa com "Ligar" e "Orçamento".

## Dados da empresa

Conferidos no cadastro da Receita Federal (situação ativa):

- Razão social: Moraes Mecânica X Serviços e Comércio Ltda. Nome fantasia no cadastro: Auto Club Automotivo.
- CNPJ 39.519.041/0001-24, aberta em 22/10/2020.
- Endereço: Av. Desembargador Mário da Silva Nunes, s/n, Jardim Limoeiro, Serra - ES, CEP 29164-044.
- Telefone do cadastro: (27) 3328-1611.
- Atividades: manutenção e reparação mecânica, comércio de peças e acessórios novos, comércio de pneus e câmaras.

## Antes de entregar ao cliente

O que está abaixo é ilustrativo e precisa ser confirmado com a oficina:

- Horário de atendimento (seg. a sex. 8h às 18h, sáb. 8h às 12h).
- Número de WhatsApp, se houver.
- Lista de serviços: freio, suspensão, motor, embreagem, arrefecimento e revisão foram escolhidos pela atividade da empresa. Retirar o que a oficina não faz.
- Montagem de pneus na oficina e itens do balcão de peças.
- Os passos do atendimento (avaliação, orçamento com peça e mão de obra separados, serviço só depois do ok).
- Intervalos de troca de óleo usados na etiqueta: mineral 5.000 km ou 6 meses, semissintético 7.500 km ou 6 meses, sintético 10.000 km ou 12 meses. Ficam no `app.js`, no objeto `oleos`.
- Nome na página: "Moraes Mecânica". Se a fachada usar "Auto Club Automotivo", ajustar o cabeçalho e o título.
- Logotipo: a placa com o "M" é uma proposta. Se a oficina já tiver logo, substituir no cabeçalho, no rodapé, na etiqueta e no `assets/favicon.svg`.

## Fotos

Fotos reais da oficina, cedidas pela empresa. As placas dos carros de clientes foram borradas. As versões para web, em WebP, ficam em `assets/img/`.

- `elevadores`: galpão com a fileira de elevadores (abertura e imagem de compartilhamento `og-image.jpg`).
- `box` e `box-detalhe`: carro de capô aberto no elevador (serviços). No computador e no celular entra o recorte `box-detalhe`; no tablet, a foto inteira.
- `recepcao`: balcão de atendimento e entrada dos carros (orçamento).
- `fachada`: fachada com a placa do Centro Automotivo AutoClub (onde fica).

A única foto ilustrativa que ficou é a do balcão de peças com pneus (seção peças e pneus), feita para esta proposta porque não há foto real dessa parte da loja. Se a oficina mandar uma foto do balcão ou do estoque de pneus, trocar `assets/img/pecas.webp` e `pecas-720.webp`.

## Fontes

Big Shoulders Display (títulos), Overpass (textos) e Atkinson Hyperlegible Mono (rótulos e etiqueta), do Google Fonts, sob SIL Open Font License, reduzidas aos caracteres do português. Licenças em `assets/fonts/`.
