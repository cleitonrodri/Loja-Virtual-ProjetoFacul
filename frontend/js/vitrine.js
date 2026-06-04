// Roda quando a página da Vitrine abre
window.onload = async () => {
  // 1. Procura por '?categoria=algumacoisa' na URL
  const parametrosUrl = new URLSearchParams(window.location.search);
  const categoriaEscolhida = parametrosUrl.get("categoria");

  // Muda o título da página se o usuario escolheu uma categoria
  if (categoriaEscolhida) {
    // Põe a primeira letra em maiúsculo só pra ficar bonito no título (ex: 'mouse' vira 'Mouse')
    const tituloFormatado = categoriaEscolhida.charAt(0).toUpperCase() + categoriaEscolhida.slice(1);
    document.getElementById("tituloVitrine").innerText = `Resultados para: ${tituloFormatado}`;
  }

  try {
    // 2. OBusca TODOS os produtos do banco
    const resposta = await fetch("http://localhost:3000/produtos");
    const todosProdutos = await resposta.json();

    // 3. (Filtro Exato)
    let produtosParaMostrar = todosProdutos;

    if (categoriaEscolhida) {
      // se a categoria do banco for EXATAMENTE IGUAL a da URL, ele mostra!
      produtosParaMostrar = todosProdutos.filter(
        (produto) => produto.categoria === categoriaEscolhida,
      );
    }

    // 4. Desenhando na tela com as classes
    const divGrade = document.getElementById("gradeProdutos");

    if (produtosParaMostrar.length === 0) {
      divGrade.innerHTML = "<p class='msg-vazio' style='color: var(--texto-mutado);'>Nenhum produto encontrado nesta categoria no momento.</p>";
      return;
    }

    // Faz o loop e cria o HTML de cada cartão usando as classes exatas do vitrine.css
    divGrade.innerHTML = produtosParaMostrar
      .map(
        (produto) => `
            <div class="card-produto">
                <div class="card-container-foto">
                    <img src="${produto.imagem || 'https://via.placeholder.com/200x200/0F172A/06B6D4?text=TechStore'}" alt="${produto.nome}">
                </div>
                
                <p class="marca-produto">${produto.marca || 'Marca Genérica'}</p>
                <h3 class="titulo-produto">${produto.nome}</h3>
                
                <p class="preco-produto">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                
                <button class="btn-primario" onclick="adicionarAoCarrinho('${produto.nome}', '${produto.preco}', '${produto.imagem || ''}')">
                    🛒 Adicionar ao Carrinho
                </button>
            </div>
        `,
      )
      .join(""); // O .join('') tira as vírgulas do array
  } catch (erro) {
    console.error("Erro ao carregar a vitrine:", erro);
    document.getElementById("gradeProdutos").innerHTML =
      "<p class='msg-erro' style='color: #EF233C;'>Erro ao conectar com o servidor.</p>";
  }
};

// 5. A Função da Mochila (Atualizada para guardar a imagem)
function adicionarAoCarrinho(nomeDoProduto, precoDoProduto, imagemDoProduto) {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  let carrinhoDeCompras = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

  // O push empurra o novo produto para o final da lista
  carrinhoDeCompras.push({
    nome: nomeDoProduto,
    preco: precoDoProduto,
    imagem: imagemDoProduto
  });

  // Salva a mochila atualizada no disco do navegador
  localStorage.setItem("carrinho", JSON.stringify(carrinhoDeCompras));
  alert(`${nomeDoProduto} foi adicionado ao seu carrinho!`);
}