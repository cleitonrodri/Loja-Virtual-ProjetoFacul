window.onload = async () => {
  // 1. O Detetive da URL agora procura por 'categoria'
  const parametrosUrl = new URLSearchParams(window.location.search);
  const categoriaEscolhida = parametrosUrl.get("categoria");

  // Muda o título da página se o usuario escolheu uma categoria
  if (categoriaEscolhida) {
    // Põe a primeira letra em maiúsculo só pra ficar bonito no título
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
        "<p>Nenhum produto encontrado nesta categoria no momento.</p>";
      return;
    }

    // Faz o loop e cria o HTML de cada cartão
    divGrade.innerHTML = produtosParaMostrar
      .map(
        (produto) => `
            <div class="cartao-produto" style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; width: 250px;">
                <h3>${produto.nome}</h3>
                <p style="font-size: 12px; color: gray;">Marca: ${produto.marca}</p>
                <p class="preco" style="font-weight: bold; color: green; font-size: 18px;">R$ ${produto.preco}</p>
                
                <button onclick="adicionarAoCarrinho('${produto.nome}', '${produto.preco}')" 
                        style="background-color: #007bff; color: white; border: none; padding: 10px; cursor: pointer; width: 100%; border-radius: 4px;">
                    🛒 Adicionar ao Carrinho
                </button>
            </div>
        `,
      )
      .join(""); // O .join('') tira as vírgulas do array
  } catch (erro) {
    console.error("Erro ao carregar a vitrine:", erro);
    document.getElementById("gradeProdutos").innerHTML =
      "<p>Erro ao conectar com o servidor.</p>";
  }
};

// 5. A Função da Mochila (Mantida intacta)
function adicionarAoCarrinho(nomeDoProduto, precoDoProduto) {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  let carrinhoDeCompras = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

  carrinhoDeCompras.push({
    nome: nomeDoProduto,
    preco: precoDoProduto,
  });

  localStorage.setItem("carrinho", JSON.stringify(carrinhoDeCompras));
  alert(`${nomeDoProduto} foi adicionado ao seu carrinho!`);
}
