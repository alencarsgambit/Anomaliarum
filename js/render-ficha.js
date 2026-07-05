/**
 * render-ficha.js — montagem da ficha individual de anomalia
 * Enciclopédia Anomaliarum
 */

window.Enciclopedia = window.Enciclopedia || {};

window.Enciclopedia.renderFicha = (function () {
  "use strict";

  var utils = window.Enciclopedia.utils;

  var ATRIBUTOS = [
    { chave: "velocidade", label: "Velocidade" },
    { chave: "intelecto", label: "Intelecto" },
    { chave: "forca", label: "Força" },
    { chave: "constituicao", label: "Constituição" }
  ];

  var ESCALA_MAX = 5;

  function montarBarraAtributo(item) {
    var esc = utils.escapeHtml;
    var valor = Math.max(0, Math.min(ESCALA_MAX, Number(item.valor) || 0));
    var segmentos = "";
    for (var i = 0; i < ESCALA_MAX; i++) {
      segmentos += '<span class="attr-bar__seg' + (i < valor ? " attr-bar__seg--filled" : "") + '"></span>';
    }
    return (
      '<div class="attr-bar">' +
        '<span class="attr-bar__label">' + esc(item.label) + '</span>' +
        '<div class="attr-bar__track" role="img" aria-label="' + esc(item.label) + ': ' + valor + ' de ' + ESCALA_MAX + '">' +
          segmentos +
        '</div>' +
        '<span class="attr-bar__value">' + valor + '/' + ESCALA_MAX + '</span>' +
      '</div>'
    );
  }

  function montarHexagono(item) {
    var esc = utils.escapeHtml;
    var valor = Math.max(0, Math.min(ESCALA_MAX, Number(item.valor) || 0));
    return (
      '<div class="ficha-atributos__item">' +
        '<div class="hex hex--grande" aria-hidden="true">' +
          '<span class="hex__value">' + valor + '</span>' +
          '<span class="hex__label">/' + ESCALA_MAX + '</span>' +
        '</div>' +
        '<span class="attr-bar__label">' + esc(item.label) + '</span>' +
      '</div>'
    );
  }

  function montarCampo(rotulo, valor) {
    var esc = utils.escapeHtml;
    return (
      '<div class="ficha-campo">' +
        '<span class="ficha-campo__rotulo">' + esc(rotulo) + '</span>' +
        '<span class="ficha-campo__valor">' + esc(valor || "Desconhecido") + '</span>' +
      '</div>'
    );
  }

  function montarFicha(anomalia) {
    var esc = utils.escapeHtml;
    var bio = anomalia.biografico || {};
    var fisico = anomalia.fisico || {};
    var atributosBrutos = anomalia.atributos || {};
    var chaveRes = utils.chaveRessonancia(anomalia.ressonancia);
    var chaveClasse = utils.chaveClasse(anomalia.classe);
    var labelRes = utils.labelRessonancia(anomalia.ressonancia);
    var labelClasse = utils.labelClasse(anomalia.classe);
    var imagem = anomalia._imagemResolvida || window.Enciclopedia.dataLoader.CAMINHO_PLACEHOLDER;

    var listaAtributos = ATRIBUTOS.map(function (a) {
      return { chave: a.chave, label: a.label, valor: atributosBrutos[a.chave] };
    });

    var barcodeSpans = new Array(20).fill("<span></span>").join("");

    return (
      '<article>' +

        '<header class="ficha-cracha">' +
          '<div class="ficha-cracha__foto">' +
            '<img src="' + esc(imagem) + '" alt="' +
              (anomalia.imagem
                ? "Registro fotográfico de " + esc(anomalia.nome)
                : "Registro fotográfico não disponível para " + esc(anomalia.nome)) +
            '">' +
          '</div>' +
          '<div class="ficha-cracha__corpo">' +
            '<div class="ficha-cracha__topo">' +
              '<div>' +
                '<p class="ficha-cracha__id">' + esc(anomalia.id || "") + '</p>' +
                '<h1 class="ficha-cracha__nome">' + esc(anomalia.nome || "Anomalia sem nome") + '</h1>' +
                (anomalia.titulo_anomalia
                  ? '<p class="ficha-cracha__titulo">' + esc(anomalia.titulo_anomalia) + '</p>'
                  : "") +
              '</div>' +
              '<div class="ficha-cracha__selos">' +
                '<span class="badge-ressonancia badge-ressonancia--' + chaveRes + '">' + esc(labelRes) + '</span>' +
                '<span class="badge-classe badge-classe--' + chaveClasse + '">' + esc(labelClasse) + '</span>' +
              '</div>' +
            '</div>' +

            '<div class="ficha-cracha__status">' +
              '<span class="ficha-cracha__status-item">Status<strong>' + esc(anomalia.status || "Desconhecido") + '</strong></span>' +
              '<span class="ficha-cracha__status-item">Registro<strong>' + esc(utils.formatarData(anomalia.data_registro)) + '</strong></span>' +
              '<div class="barcode" aria-hidden="true">' + barcodeSpans + '</div>' +
            '</div>' +
          '</div>' +
        '</header>' +

        '<section class="ficha-secao">' +
          '<div class="ficha-info-grid">' +
            '<div class="ficha-painel">' +
              '<h2 class="ficha-painel__titulo">Informações biográficas</h2>' +
              montarCampo("Nome", bio.nome_sujeito) +
              montarCampo("Idade", bio.idade) +
              montarCampo("Gênero", bio.genero) +
              (bio.descricao ? '<p class="ficha-descricao">' + esc(bio.descricao) + '</p>' : "") +
            '</div>' +

            '<div class="ficha-painel">' +
              '<h2 class="ficha-painel__titulo">Informações físicas</h2>' +
              montarCampo("Altura", fisico.altura) +
              montarCampo("Peso", fisico.peso) +
              montarCampo("Porte", fisico.porte) +
              montarCampo("Traços", fisico.tracos) +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section class="ficha-secao">' +
          '<div class="ficha-painel">' +
            '<h2 class="ficha-painel__titulo">Atributos</h2>' +
            '<div class="ficha-atributos">' +
              listaAtributos.map(montarHexagono).join("") +
            '</div>' +
            '<div class="ficha-atributos__barras" style="margin-top: var(--sp-2);">' +
              listaAtributos.map(montarBarraAtributo).join("") +
            '</div>' +
          '</div>' +
        '</section>' +

        (anomalia.notas
          ? '<section class="ficha-secao">' +
              '<div class="ficha-notas">' +
                '<p class="ficha-notas__titulo">Notas de campo</p>' +
                '<p class="ficha-notas__texto">' + esc(anomalia.notas) + '</p>' +
              '</div>' +
            '</section>'
          : "") +

      '</article>'
    );
  }

  function renderizarEstadoErro(container, opcoes) {
    opcoes = opcoes || {};
    var esc = utils.escapeHtml;
    container.innerHTML =
      '<div class="ficha-estado">' +
        '<span class="estado-vazio__selo">' + esc(opcoes.selo || "Registro não encontrado") + '</span>' +
        '<h1 class="estado-vazio__titulo">' + esc(opcoes.titulo || "Esta anomalia não consta no arquivo") + '</h1>' +
        '<p class="estado-vazio__texto">' + esc(opcoes.texto || "Verifique o link ou volte ao índice completo.") + '</p>' +
        '<a class="btn" href="anomalias.html" style="margin-top: var(--sp-3);">← Voltar ao índice</a>' +
      '</div>';
  }

  function atualizarMetadados(anomalia) {
    if (!anomalia) return;
    document.title = anomalia.nome + " — Enciclopédia Anomaliarum";
    var breadcrumbAtual = document.getElementById("breadcrumb-atual");
    if (breadcrumbAtual) breadcrumbAtual.textContent = anomalia.nome;
  }

  return {
    montarFicha: montarFicha,
    renderizarEstadoErro: renderizarEstadoErro,
    atualizarMetadados: atualizarMetadados
  };
})();
