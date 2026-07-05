/**
 * data-loader.js — carregamento de dados das anomalias
 * Enciclopédia Anomaliarum
 *
 * GitHub Pages não permite listar diretórios via JS, então o fluxo é:
 *   1. buscar anomalias/index.json (lista de slugs)
 *   2. para cada slug, buscar anomalias/<slug>/dados.json
 *   3. resolver o caminho da imagem (ou usar o placeholder padrão)
 */

window.Enciclopedia = window.Enciclopedia || {};

window.Enciclopedia.dataLoader = (function () {
  "use strict";

  var CAMINHO_INDICE = "anomalias/index.json";
  var CAMINHO_PLACEHOLDER = "assets/img/placeholder-anomalia.png";

  var cachePromise = null;

  function caminhoAnomalias(slug) {
    return "anomalias/" + slug + "/";
  }

  function resolverImagem(slug, anomalia) {
    if (anomalia.imagem) {
      return caminhoAnomalias(slug) + anomalia.imagem;
    }
    return CAMINHO_PLACEHOLDER;
  }

  async function buscarJson(url) {
    var resposta = await fetch(url, { cache: "no-cache" });
    if (!resposta.ok) {
      throw new Error("Falha ao buscar " + url + " (HTTP " + resposta.status + ")");
    }
    return resposta.json();
  }

  async function carregarIndice() {
    var indice = await buscarJson(CAMINHO_INDICE);
    return (indice && Array.isArray(indice.anomalias)) ? indice.anomalias : [];
  }

  async function carregarAnomalia(slug) {
    var dados = await buscarJson(caminhoAnomalias(slug) + "dados.json");
    dados.slug = dados.slug || slug;
    dados._imagemResolvida = resolverImagem(slug, dados);
    return dados;
  }

  /**
   * Carrega todas as anomalias cadastradas em anomalias/index.json.
   * Entradas cujo dados.json falhe ao carregar são ignoradas (com aviso no
   * console) em vez de derrubar o carregamento das demais.
   * O resultado é cacheado em memória — chame `invalidarCache()` para forçar
   * uma nova busca de rede.
   */
  function carregarTodas() {
    if (cachePromise) return cachePromise;

    cachePromise = carregarIndice().then(function (slugs) {
      var pedidos = slugs.map(function (slug) {
        return carregarAnomalia(slug).catch(function (erro) {
          console.warn("[Enciclopedia] não foi possível carregar a anomalia \"" + slug + "\":", erro);
          return null;
        });
      });
      return Promise.all(pedidos).then(function (resultados) {
        return resultados.filter(Boolean);
      });
    });

    return cachePromise;
  }

  function invalidarCache() {
    cachePromise = null;
  }

  return {
    carregarTodas: carregarTodas,
    carregarAnomalia: carregarAnomalia,
    invalidarCache: invalidarCache,
    CAMINHO_PLACEHOLDER: CAMINHO_PLACEHOLDER
  };
})();
