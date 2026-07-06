# Enciclopédia Anomaliarum

Arquivo estático (HTML + CSS + JS puro) de anomalias classificadas, no
estilo de um dossiê confidencial. Feito para rodar direto no GitHub Pages,
sem build step.

> Ver `ESTRUTURA.md` para o mapa completo de pastas e o schema de dados.

## Progresso

Este projeto foi construído em partes. **Status atual: Parte 6 (concluído).**

- [x] **Parte 1 — Fundação**
  - Estrutura de pastas do projeto.
  - Sistema de design (`css/reset.css`, `css/variables.css`,
    `css/style.css`, `css/components.css`): paleta, tipografia, carimbo
    "CLASSIFIED", hexágonos de atributo, barcode, badges de ressonância
    e classe, cards de anomalia.
  - `index.html` (página principal) com hero, navegação e seções de
    destaque (conteúdo estático de demonstração por enquanto).
  - `js/main.js` inicial (marca a aba ativa do menu).
  - `anomalias/index.json` vazio, pronto para receber entradas.
  - Imagem placeholder padrão em `assets/img/placeholder-anomalia.png`.
- [x] **Parte 2 — Conteúdo fixo**
  - `classificacoes.html`: definição de Anomalia, as 4 Ressonâncias (com
    cor + palavras-chave de cada uma) e a legenda das 5 Classes de risco
    (Green a Black, com descrição e protocolo padrão para cada uma).
  - `sobre.html`: lore do arquivo (autoria V. I. Volkov & H. M. McMaster),
    propósito do site e um passo a passo de como cadastrar uma nova
    anomalia (subpasta, `dados.json`, imagem, `index.json`).
  - Novos componentes visuais reaproveitáveis em `components.css`:
    hero secundário de página, caixa de definição, card de ressonância
    com chips de palavra-chave, tabela de legenda de classes e lista de
    passos numerada.
- [x] **Parte 3 — Índice, busca e dados dinâmicos**
  - `js/utils.js`: helpers de escape/normalização de texto, debounce,
    mapeamento de ressonâncias/classes e formatação de data.
  - `js/data-loader.js`: busca `anomalias/index.json`, depois cada
    `dados.json`, resolve a imagem (ou usa o placeholder) e cacheia o
    resultado em memória.
  - `js/render-cards.js`: monta os cards de anomalia (reaproveitado na
    home e no índice) e os estados de "vazio" / "erro".
  - `js/search.js`: filtro por texto + ressonância + classe e ordenação
    (recentes / alfabética / classe) — tudo em memória, sem novas
    requisições.
  - `anomalias.html`: índice completo com campo de busca, chips de
    filtro por ressonância e classe, ordenação e contagem de resultados.
  - `index.html` passou a carregar as 3 anomalias mais recentes
    dinamicamente em vez de cards estáticos; o botão "Sortear registro"
    agora leva a `anomalias.html?aleatoria=1`, que sorteia e destaca um
    card real.
  - Testado localmente com Playwright (busca, filtros, estado vazio e
    "anomalia aleatória" funcionando como esperado).
- [x] **Parte 4 — Ficha individual da anomalia**
  - `anomalia.html`: template dinâmico que lê `?slug=` da URL e monta a
    ficha completa via `js/render-ficha.js`.
  - `css/ficha.css`: crachá/ID (foto + nome + código + selos + barcode),
    painéis de informações biográficas e físicas, hexágonos de atributo
    (com barras 0–5 como reforço acessível dos mesmos valores) e bloco de
    notas de campo em monoespaçada.
  - Estados de erro tratados: URL sem `?slug=` e slug inexistente no
    arquivo, ambos com link de volta para o índice.
  - Testado localmente com Playwright: ficha renderiza todos os campos
    corretamente, clique num card do índice navega para a ficha certa, e
    os dois estados de erro aparecem como esperado.
- [x] **Parte 5 — Anomalias de exemplo**
  - 3 anomalias cadastradas em `anomalias/` a partir do material de
    `ANOTAÇÕES_DA_NICK_2.pdf`: `criatura-tentaculo`, `sem-olhos` e
    `abominacao`, cada uma com `dados.json` completo (biográfico, físico,
    atributos, notas) e `foto.jpg` própria.
  - `anomalias/index.json` atualizado com os três slugs, deixando o
    índice, a home e as fichas individuais totalmente funcionais de
    ponta a ponta.
- [x] **Parte 6 — Documentação final**
  - `README.md` revisado e fechado: instruções de execução local,
    passo a passo de contribuição (alinhado ao comportamento real de
    `js/data-loader.js`) e guia de deploy no GitHub Pages.

## Como rodar localmente

Como o site usa `fetch()` para carregar os JSONs das anomalias, ele precisa
ser servido por um servidor HTTP local (abrir o `index.html` direto do
disco, via `file://`, bloqueia o `fetch` no navegador).

Com Python já instalado:

```bash
cd enciclopedia-anomaliarum
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

Alternativas equivalentes, se preferir:

```bash
# Node.js (pacote npx já vem com o Node)
npx serve .

# VS Code
# instale a extensão "Live Server" e clique em "Go Live"
```

Páginas principais para conferir durante o desenvolvimento:

- `index.html` — home, com as anomalias mais recentes e o sorteio aleatório.
- `anomalias.html` — índice completo, com busca e filtros.
- `anomalia.html?slug=sem-olhos` — ficha individual (troque o slug pelo de
  qualquer pasta em `anomalias/`).
- `classificacoes.html` e `sobre.html` — conteúdo fixo.

## Como contribuir com uma nova anomalia

1. Crie uma subpasta em `anomalias/<slug-da-anomalia>/` (use letras
   minúsculas e hífens, ex: `homem-de-giz`).
2. Dentro dela, adicione um `dados.json` seguindo o schema descrito em
   `ESTRUTURA.md` — use um dos arquivos existentes (`anomalias/sem-olhos/dados.json`,
   por exemplo) como modelo. Campos obrigatórios: `id`, `slug` (igual ao
   nome da pasta), `nome`, `titulo_anomalia`, `classe`, `ressonancia`
   (`Colerica`, `Sanguinea`, `Melancolica` ou `Fleumatica`) e `raridade`
   (`Comum` ou `Singular` — se omitido, o site assume `Comum`), além dos
   blocos `biografico`, `fisico` e `atributos` (cada atributo de 0 a 5).
3. Adicione **no máximo uma imagem** na mesma subpasta (`jpg`, `png` ou
   `webp`) e aponte o nome exato do arquivo no campo `"imagem"` do JSON.
   Se não houver imagem, deixe o campo vazio ou remova-o — o site usa
   automaticamente `assets/img/placeholder-anomalia.png`.
4. Adicione o slug da nova pasta à lista em `anomalias/index.json`. Sem
   esse passo a anomalia existe no disco, mas o site não a encontra (o
   GitHub Pages não permite listar diretórios via JS).
5. Rode o servidor local (seção acima) e confira em `anomalias.html` se o
   card aparece e se `anomalia.html?slug=<seu-slug>` monta a ficha
   corretamente antes de subir a alteração.

### Solução de problemas comuns

- **A anomalia não aparece no índice:** confira se o slug foi realmente
  adicionado a `anomalias/index.json` e se o nome da pasta bate com o
  slug (maiúsculas/minúsculas importam).
- **Ficha abre com erro "anomalia não encontrada":** o parâmetro `?slug=`
  na URL precisa ser idêntico ao nome da subpasta.
- **Imagem não carrega (aparece o placeholder):** verifique se o valor do
  campo `"imagem"` no JSON é exatamente igual ao nome do arquivo na
  pasta, incluindo extensão (`foto.jpg` ≠ `Foto.JPG`).
- **`fetch` falhando com erro de CORS ou "Failed to fetch":** o site
  precisa ser aberto via `http://localhost:...`, nunca direto do disco
  (`file://`) — veja "Como rodar localmente".

## Deploy no GitHub Pages

1. Suba este repositório para o GitHub (branch `main`).
2. Em **Settings → Pages**, aponte a fonte para a raiz (`/`) da branch
   `main`.
3. Pronto — não há passo de build.

---

*Enciclopédia Anomaliarum — arquivo fictício sem fins lucrativos, autoria
de V. I. Volkov & H. M. McMaster.*
