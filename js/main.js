/**
 * main.js — inicialização geral
 * Enciclopédia Anomaliarum
 *
 * Nesta primeira etapa (Parte 1), este arquivo cuida apenas de:
 *  - marcar a aba de navegação ativa conforme a página atual;
 *  - redirecionar a busca do header para anomalias.html?q=...
 *
 * Nas próximas partes, data-loader.js, search.js, render-cards.js e
 * render-ficha.js vão assumir o carregamento e a renderização dos
 * dados reais das anomalias.
 */

(function () {
  "use strict";

  function marcarAbaAtiva() {
    var paginaAtual = window.location.pathname.split("/").pop() || "index.html";
    var abas = document.querySelectorAll(".dossier-tab");

    abas.forEach(function (aba) {
      var href = aba.getAttribute("href");
      if (href === paginaAtual) {
        aba.setAttribute("aria-current", "page");
      } else {
        aba.removeAttribute("aria-current");
      }
    });
  }

  function init() {
    marcarAbaAtiva();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
