// O "Ouvinte" que roda quando a página da Vitrine abre
window.onload = async () => {
  // 1. O Detetive da URL agora procura por '?categoria=algumacoisa'
  const parametrosUrl = new URLSearchParams(window.location.search);
  const categoriaEscolhida = parametrosUrl.get("categoria");

  // Muda o título da página se o usuario escolheu uma categoria
  if (categoriaEscolhida) {
    // Põe a primeira letra em maiúsculo só pra ficar bonito no título (ex: 'mouse' vira 'Mouse')
    const tituloFormatado =
      categoriaEscolhida.charAt(0).toUpperCase() + categoriaEscolhida.slice(1);
    document.getElementById("tituloVitrine").innerText =
      `Resultados para: ${tituloFormatado}`;
  }

  try {
    // 2. O Garçom busca TODOS os produtos do banco
    const resposta = await fetch("http://localhost:3000/produtos");
    const todosProdutos = await resposta.json();

    // 3.(Filtro Exato)
    let produtosParaMostrar = todosProdutos;

    if (categoriaEscolhida) {
      // se a categoria do banco for EXATAMENTE IGUAL a da URL, ele mostra!
      produtosParaMostrar = todosProdutos.filter(
        (produto) => produto.categoria === categoriaEscolhida,
      );
    }

    // 4. Desenhando na tela
    const divGrade = document.getElementById("gradeProdutos");

    if (produtosParaMostrar.length === 0) {
      divGrade.innerHTML =
        "<p class='msg-vazio'>Nenhum produto encontrado nesta categoria no momento.</p>";
      return;
    }

    // Faz o loop e cria o HTML de cada cartão usando classes CSS
    divGrade.innerHTML = produtosParaMostrar
      .map(
        (produto) => `
            <div class="cartao-produto">
                <h3>${produto.nome}</h3>
                <p class="marca-produto">Marca: ${produto.marca}</p>
                <p class="preco-produto">R$ ${produto.preco}</p>
                
                <button class="btn-adicionar" onclick="adicionarAoCarrinho('${produto.nome}', '${produto.preco}')">
                    🛒 Adicionar ao Carrinho
                </button>
            </div>
        `,
      )
      .join(""); // O .join('') tira as vírgulas do array
  } catch (erro) {
    console.error("Erro ao carregar a vitrine:", erro);
    document.getElementById("gradeProdutos").innerHTML =
      "<p class='msg-erro'>Erro ao conectar com o servidor.</p>";
  }
};

// 5. A Função da Mochila
function adicionarAoCarrinho(nomeDoProduto, precoDoProduto) {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  let carrinhoDeCompras = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

  // O push empurra o novo produto para o final da lista (array)
  carrinhoDeCompras.push({
    nome: nomeDoProduto,
    preco: precoDoProduto,
  });

  // Salva a mochila atualizada no disco do navegador
  localStorage.setItem("carrinho", JSON.stringify(carrinhoDeCompras));
  alert(`${nomeDoProduto} foi adicionado ao seu carrinho!`);
}
