/**
 * render-cards.js — renderização dos cards de anomalia
 * Enciclopédia Anomaliarum
 */

window.Enciclopedia = window.Enciclopedia || {};

window.Enciclopedia.renderCards = (function () {
  "use strict";

  var utils = window.Enciclopedia.utils;

  function montarCard(anomalia) {
    var esc = utils.escapeHtml;
    var chaveRes = utils.chaveRessonancia(anomalia.ressonancia);
    var chaveClasse = utils.chaveClasse(anomalia.classe);
    var labelRes = utils.labelRessonancia(anomalia.ressonancia);
    var labelClasse = utils.labelClasse(anomalia.classe);
    var imagem = anomalia._imagemResolvida || window.Enciclopedia.dataLoader.CAMINHO_PLACEHOLDER;
    var titulo = anomalia.titulo_anomalia || "";

    return (
      '<article class="card-anomalia" data-slug="' + esc(anomalia.slug) + '">' +
        '<a href="anomalia.html?slug=' + encodeURIComponent(anomalia.slug) + '" class="card-anomalia__link" style="display:contents;">' +
          '<div class="card-anomalia__media">' +
            '<img src="' + esc(imagem) + '" alt="' +
              (anomalia.imagem
                ? "Registro fotográfico de " + esc(anomalia.nome)
                : "Registro fotográfico não disponível para " + esc(anomalia.nome)) +
            '" loading="lazy">' +
          '</div>' +
          '<div class="card-anomalia__body">' +
            '<span class="card-anomalia__id">' + esc(anomalia.id || "") + '</span>' +
            '<h3 class="card-anomalia__nome">' + esc(anomalia.nome || "Anomalia sem nome") + '</h3>' +
            (titulo ? '<p class="card-anomalia__titulo">' + esc(titulo) + '</p>' : "") +
            '<div class="card-anomalia__meta">' +
              '<span class="badge-ressonancia badge-ressonancia--' + chaveRes + '">' + esc(labelRes) + '</span>' +
              '<span class="badge-classe badge-classe--' + chaveClasse + '">' + esc(labelClasse) + '</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
      '</article>'
    );
  }

  function renderizar(lista, container) {
    if (!container) return;
    if (!lista || lista.length === 0) {
      container.innerHTML = "";
      return;
    }
    container.innerHTML = lista.map(montarCard).join("");
  }

  function renderizarEstadoVazio(container, opcoes) {
    if (!container) return;
    opcoes = opcoes || {};
    var titulo = opcoes.titulo || "Nenhum registro encontrado";
    var texto = opcoes.texto || "Ajuste os filtros ou o termo de busca e tente novamente.";
    container.innerHTML =
      '<div class="estado-vazio">' +
        '<span class="estado-vazio__selo">Sem correspondência</span>' +
        '<h3 class="estado-vazio__titulo">' + utils.escapeHtml(titulo) + '</h3>' +
        '<p class="estado-vazio__texto">' + utils.escapeHtml(texto) + '</p>' +
      '</div>';
  }

  function renderizarErro(container, erro) {
    if (!container) return;
    console.error("[Enciclopedia] erro ao carregar anomalias:", erro);
    container.innerHTML =
      '<div class="estado-vazio">' +
        '<span class="estado-vazio__selo">Falha de acesso</span>' +
        '<h3 class="estado-vazio__titulo">Não foi possível carregar o arquivo</h3>' +
        '<p class="estado-vazio__texto">' +
          "Verifique se o site está sendo servido por um servidor HTTP local " +
          "(o carregamento via <code>file://</code> bloqueia o fetch dos JSONs)." +
        '</p>' +
      '</div>';
  }

  return {
    montarCard: montarCard,
    renderizar: renderizar,
    renderizarEstadoVazio: renderizarEstadoVazio,
    renderizarErro: renderizarErro
  };
})();
