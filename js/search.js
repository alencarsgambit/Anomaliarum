/**
 * search.js — busca, filtros e ordenação (client-side)
 * Enciclopédia Anomaliarum
 *
 * Toda a filtragem acontece em memória sobre a lista já carregada pelo
 * data-loader — nenhuma nova requisição é feita ao digitar ou trocar filtro.
 */

window.Enciclopedia = window.Enciclopedia || {};

window.Enciclopedia.search = (function () {
  "use strict";

  var utils = window.Enciclopedia.utils;

  /** Concatena os campos pesquisáveis de uma anomalia em uma string normalizada. */
  function textoPesquisavel(anomalia) {
    var partes = [
      anomalia.id,
      anomalia.nome,
      anomalia.titulo_anomalia,
      anomalia.notas,
      anomalia.biografico && anomalia.biografico.descricao,
      anomalia.fisico && anomalia.fisico.tracos
    ];
    return utils.normalizar(partes.filter(Boolean).join(" "));
  }

  /**
   * @param {Array} lista - anomalias carregadas
   * @param {Object} estado
   * @param {string} estado.texto
   * @param {Set<string>} estado.ressonancias - chaves selecionadas (vazio = todas)
   * @param {Set<string>} estado.classes - chaves selecionadas (vazio = todas)
   * @param {Set<string>} estado.raridades - chaves selecionadas (vazio = todas)
   * @param {string} estado.ordenacao - "recentes" | "alfabetica" | "classe"
   */
  function aplicar(lista, estado) {
    var termo = utils.normalizar(estado.texto);

    var filtrada = lista.filter(function (anomalia) {
      var passaTexto = !termo || textoPesquisavel(anomalia).indexOf(termo) !== -1;
      var passaRes =
        estado.ressonancias.size === 0 ||
        estado.ressonancias.has(utils.chaveRessonancia(anomalia.ressonancia));
      var passaClasse =
        estado.classes.size === 0 ||
        estado.classes.has(utils.chaveClasse(anomalia.classe));
      var passaRaridade =
        !estado.raridades ||
        estado.raridades.size === 0 ||
        estado.raridades.has(utils.chaveRaridade(anomalia.raridade));
      return passaTexto && passaRes && passaClasse && passaRaridade;
    });

    return ordenar(filtrada, estado.ordenacao);
  }

  function ordenar(lista, criterio) {
    var copia = lista.slice();

    switch (criterio) {
      case "alfabetica":
        copia.sort(function (a, b) {
          return (a.nome || "").localeCompare(b.nome || "", "pt-BR");
        });
        break;
      case "classe":
        copia.sort(function (a, b) {
          var diff = utils.ordemClasse(a.classe) - utils.ordemClasse(b.classe);
          return diff !== 0 ? diff : (a.nome || "").localeCompare(b.nome || "", "pt-BR");
        });
        break;
      case "recentes":
      default:
        copia.sort(function (a, b) {
          return (b.data_registro || "").localeCompare(a.data_registro || "");
        });
        break;
    }

    return copia;
  }

  return {
    aplicar: aplicar,
    ordenar: ordenar
  };
})();
