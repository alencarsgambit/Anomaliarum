/**
 * utils.js — helpers compartilhados
 * Enciclopédia Anomaliarum
 */

window.Enciclopedia = window.Enciclopedia || {};

window.Enciclopedia.utils = (function () {
  "use strict";

  /** Escapa texto antes de injetar em innerHTML, evita quebra de layout com HTML/aspas nos JSONs. */
  function escapeHtml(valor) {
    if (valor === undefined || valor === null) return "";
    return String(valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /** Atrasa a execução de fn até `espera`ms depois da última chamada — usado no campo de busca. */
  function debounce(fn, espera) {
    var temporizador;
    return function () {
      var args = arguments;
      var contexto = this;
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        fn.apply(contexto, args);
      }, espera);
    };
  }

  /** Remove acentos e normaliza para comparações de busca ("Melancólica" -> "melancolica"). */
  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  var RESSONANCIAS = {
    colerica: { label: "Colérica", chave: "colerica" },
    sanguinea: { label: "Sanguínea", chave: "sanguinea" },
    melancolica: { label: "Melancólica", chave: "melancolica" },
    fleumatica: { label: "Fleumática", chave: "fleumatica" }
  };

  var CLASSES = {
    green: { label: "Green", ordem: 1 },
    yellow: { label: "Yellow", ordem: 2 },
    orange: { label: "Orange", ordem: 3 },
    red: { label: "Red", ordem: 4 },
    black: { label: "Black", ordem: 5 }
  };

  /** Aceita "Melancolica", "melancólica" etc. e devolve a chave interna ("melancolica"). */
  function chaveRessonancia(valor) {
    return normalizar(valor);
  }

  function chaveClasse(valor) {
    return normalizar(valor);
  }

  function labelRessonancia(valor) {
    var chave = chaveRessonancia(valor);
    return (RESSONANCIAS[chave] && RESSONANCIAS[chave].label) || valor || "Desconhecida";
  }

  function labelClasse(valor) {
    var chave = chaveClasse(valor);
    return (CLASSES[chave] && CLASSES[chave].label) || valor || "—";
  }

  function ordemClasse(valor) {
    var chave = chaveClasse(valor);
    return (CLASSES[chave] && CLASSES[chave].ordem) || 99;
  }

  function formatarData(isoDate) {
    if (!isoDate) return "Data desconhecida";
    var partes = String(isoDate).split("-");
    if (partes.length !== 3) return isoDate;
    return partes[2] + "/" + partes[1] + "/" + partes[0];
  }

  return {
    escapeHtml: escapeHtml,
    debounce: debounce,
    normalizar: normalizar,
    RESSONANCIAS: RESSONANCIAS,
    CLASSES: CLASSES,
    chaveRessonancia: chaveRessonancia,
    chaveClasse: chaveClasse,
    labelRessonancia: labelRessonancia,
    labelClasse: labelClasse,
    ordemClasse: ordemClasse,
    formatarData: formatarData
  };
})();
