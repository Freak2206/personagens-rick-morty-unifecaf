const URL_API = "https://rickandmortyapi.com/api/character";

const areaCards = document.getElementById("cards");
const mensagem = document.getElementById("mensagem");
const campoBusca = document.getElementById("busca");
const filtroStatus = document.getElementById("filtro-status");
const btnFavoritos = document.getElementById("btn-favoritos");
const btnAnterior = document.getElementById("anterior");
const btnProxima = document.getElementById("proxima");
const textoPagina = document.getElementById("pagina-atual");

let paginaAtual = 1;
let totalPaginas = 1;
let mostrandoFavoritos = false;
let personagensCarregados = {};

// favoritos salvos no navegador
function lerFavoritos() {
  try {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
  } catch (erro) {
    return [];
  }
}

function salvarFavoritos(lista) {
  try {
    localStorage.setItem("favoritos", JSON.stringify(lista));
  } catch (erro) {
    // sem localStorage, segue sem salvar
  }
}

const traducaoStatus = { Alive: "Vivo", Dead: "Morto", unknown: "Desconhecido" };
const traducaoEspecie = { Human: "Humano", Alien: "Alienígena", Humanoid: "Humanoide", Robot: "Robô", Animal: "Animal", Cronenberg: "Cronenberg", Disease: "Doença", Poopybutthole: "Poopybutthole", Mythological: "Mitológico", unknown: "Desconhecida" };

// cria um card com createElement e devolve o elemento
function criarCard(personagem) {
  const card = document.createElement("article");
  card.className = "card";

  const titulo = document.createElement("h2");
  titulo.textContent = personagem.name;

  const imagem = document.createElement("img");
  imagem.src = personagem.image;
  imagem.alt = "Foto de " + personagem.name;
  imagem.loading = "lazy";

  const info = document.createElement("div");
  info.className = "info";

  const status = document.createElement("span");
  status.className = "status " + personagem.status.toLowerCase();
  status.textContent = traducaoStatus[personagem.status] || personagem.status;

  const especie = document.createElement("p");
  especie.textContent = "Espécie: " + (traducaoEspecie[personagem.species] || personagem.species);

  const origem = document.createElement("p");
  origem.textContent = "Origem: " + personagem.origin.name;

  info.appendChild(status);
  info.appendChild(especie);
  info.appendChild(origem);

  const botaoFav = document.createElement("button");
  botaoFav.className = "fav";
  botaoFav.type = "button";
  botaoFav.setAttribute("aria-label", "Favoritar " + personagem.name);
  const favoritado = lerFavoritos().includes(personagem.id);
  botaoFav.textContent = favoritado ? "♥" : "♡";
  botaoFav.addEventListener("click", function () {
    alternarFavorito(personagem.id, botaoFav);
  });

  card.appendChild(botaoFav);
  card.appendChild(titulo);
  card.appendChild(imagem);
  card.appendChild(info);

  return card;
}

function alternarFavorito(id, botao) {
  let favoritos = lerFavoritos();
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(function (f) { return f !== id; });
    botao.textContent = "♡";
  } else {
    favoritos.push(id);
    botao.textContent = "♥";
  }
  salvarFavoritos(favoritos);
  if (mostrandoFavoritos) mostrarFavoritos();
}

function mostrarCards(lista) {
  areaCards.innerHTML = "";
  lista.forEach(function (personagem) {
    personagensCarregados[personagem.id] = personagem;
    areaCards.appendChild(criarCard(personagem));
  });
}

// consumo da API com fetch
function carregarPersonagens() {
  mostrandoFavoritos = false;
  btnFavoritos.classList.remove("ativo");
  mensagem.textContent = "Carregando...";

  const params = new URLSearchParams({ page: paginaAtual });
  if (campoBusca.value.trim()) params.set("name", campoBusca.value.trim());
  if (filtroStatus.value) params.set("status", filtroStatus.value);

  fetch(URL_API + "?" + params.toString())
    .then(function (resposta) {
      if (!resposta.ok) throw new Error("Nenhum personagem encontrado.");
      return resposta.json();
    })
    .then(function (dados) {
      totalPaginas = dados.info.pages;
      mostrarCards(dados.results);
      mensagem.textContent = dados.info.count + " personagens encontrados";
      atualizarPaginacao();
    })
    .catch(function (erro) {
      areaCards.innerHTML = "";
      totalPaginas = 1;
      mensagem.textContent = erro.message;
      atualizarPaginacao();
    });
}

function mostrarFavoritos() {
  mostrandoFavoritos = true;
  btnFavoritos.classList.add("ativo");
  const ids = lerFavoritos();
  if (ids.length === 0) {
    areaCards.innerHTML = "";
    mensagem.textContent = "Você ainda não favoritou ninguém.";
    return;
  }
  mensagem.textContent = "Carregando favoritos...";
  fetch(URL_API + "/" + ids.join(","))
    .then(function (resposta) { return resposta.json(); })
    .then(function (dados) {
      const lista = Array.isArray(dados) ? dados : [dados];
      mostrarCards(lista);
      mensagem.textContent = lista.length + " favorito(s)";
    })
    .catch(function () {
      mensagem.textContent = "Erro ao carregar favoritos.";
    });
}

function atualizarPaginacao() {
  textoPagina.textContent = "Página " + paginaAtual + " de " + totalPaginas;
  btnAnterior.disabled = paginaAtual <= 1;
  btnProxima.disabled = paginaAtual >= totalPaginas;
}

btnAnterior.addEventListener("click", function () {
  paginaAtual--;
  carregarPersonagens();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

btnProxima.addEventListener("click", function () {
  paginaAtual++;
  carregarPersonagens();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

let temporizador;
campoBusca.addEventListener("input", function () {
  clearTimeout(temporizador);
  temporizador = setTimeout(function () {
    paginaAtual = 1;
    carregarPersonagens();
  }, 400);
});

filtroStatus.addEventListener("change", function () {
  paginaAtual = 1;
  carregarPersonagens();
});

btnFavoritos.addEventListener("click", function () {
  if (mostrandoFavoritos) {
    carregarPersonagens();
  } else {
    mostrarFavoritos();
  }
});

carregarPersonagens();
