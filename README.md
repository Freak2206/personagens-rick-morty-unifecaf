# Rick and Morty | Personagens

Site que mostra os personagens da série **Rick and Morty** usando a [Rick and Morty API](https://rickandmortyapi.com/). Os cards são criados dinamicamente com JavaScript a partir dos dados recebidos da API.

Projeto da disciplina de Web Development Front-End (UniFECAF).

## Funcionalidades

- Cards criados com JavaScript (`fetch`, `createElement` e `appendChild`)
- Cada card mostra foto, nome, status, espécie e origem
- Busca de personagem pelo nome
- Filtro por status (vivo, morto, desconhecido)
- Paginação
- Favoritos salvos no navegador (`localStorage`)
- Layout responsivo para celular e computador

## Tecnologias

- HTML5
- CSS3 (Grid e Flexbox)
- JavaScript (sem bibliotecas)
- Rick and Morty API (gratuita, sem token)

## Estrutura

```
├── index.html   # estrutura da página
├── style.css    # estilos e responsividade
├── script.js    # consumo da API e criação dos cards
└── README.md
```

## Como rodar no computador

1. Baixe ou clone o repositório.
2. Mantenha os três arquivos na mesma pasta.
3. Dê dois cliques no `index.html` para abrir no navegador.

É preciso ter conexão com a internet, pois os dados vêm da API.

## Sobre a API

- Endereço base: `https://rickandmortyapi.com/api`
- Endpoint usado: `/character`
- Sem autenticação, apenas requisições GET
- Documentação: https://rickandmortyapi.com/documentation

## Autor

Felipe Queiroz
