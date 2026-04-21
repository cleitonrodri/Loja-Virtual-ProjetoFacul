window.onload = () => {
  renderizarCarrinho();
};

// 1. FUNÇÃO QUE DESENHA A TELA E CALCULA O TOTAL
function renderizarCarrinho() {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  const carrinhoDeCompras = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  const divLista = document.getElementById("listaCarrinho");
  const elementoTotal = document.getElementById("valorTotal");

  // Se o carrinho estiver vazio
  if (carrinhoDeCompras.length === 0) {
    divLista.innerHTML =
      "<p class='msg-vazio'>Sua mochila está vazia! Vá até a vitrine e escolha seus hardwares.</p>";
    elementoTotal.innerText = "Total: R$ 0.00";
    return;
  }

  let htmlItens = "";
  let somaTotal = 0;

  // Passa por cada produto na mochila
  carrinhoDeCompras.forEach((produto, index) => {
    htmlItens += `
            <div class="item-carrinho">
                <div class="info-item">
                    <h4>${produto.nome}</h4>
                    <p class="preco-item">R$ ${produto.preco}</p>
                </div>
                <button class="btn-remover" onclick="removerDoCarrinho(${index})">
                  🗑️ Remover
                </button>
            </div>
    `;
    // Transforma o texto do preço em número decimal e soma
    somaTotal += parseFloat(produto.preco);
  });

  // Atualiza a tela com o HTML e o valor total formatado
  divLista.innerHTML = htmlItens;
  elementoTotal.innerText = `Total: R$ ${somaTotal.toFixed(2)}`;
}

// 2. FUNÇÃO PARA TIRAR UM ITEM ESPECÍFICO DA MOCHILA
function removerDoCarrinho(posicaoDoItem) {
  let carrinhoDeCompras = JSON.parse(localStorage.getItem("carrinho"));

  // O .splice arranca o item daquela posição específica
  carrinhoDeCompras.splice(posicaoDoItem, 1);

  // Guarda a mochila atualizada no navegador
  localStorage.setItem("carrinho", JSON.stringify(carrinhoDeCompras));

  // Manda a tela se desenhar de novo para o item sumir da vista do cliente
  renderizarCarrinho();
}

// 3. FUNÇÃO DO BOTÃO FINALIZAR COMPRA
async function finalizarCompra() {
  const usuarioSalvo = localStorage.getItem("usuario");
  const carrinhoSalvo = localStorage.getItem("carrinho");
  const carrinhoDeCompras = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

  // Segurança 1: Carrinho vazio
  if (carrinhoDeCompras.length === 0) {
    alert("Coloque produtos no carrinho antes de tentar pagar!");
    return;
  }

  // Segurança 2: Usuário não logado
  if (!usuarioSalvo || usuarioSalvo === "undefined") {
    alert("Você precisa entrar na sua conta para finalizar a compra.");
    window.location.replace("signin.html");
    return;
  }

  // Pega os dados do usuário para saber quem está comprando
  const usuarioLogado = JSON.parse(usuarioSalvo);

  // Calcula o valor total da compra
  let somaTotal = 0;
  carrinhoDeCompras.forEach((produto) => {
    somaTotal += parseFloat(produto.preco);
  });

  // O Garçom (Fetch) leva o pedido para o Backend
  try {
    const resposta = await fetch("http://localhost:3000/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: usuarioLogado.id, // ID de quem comprou
        total: somaTotal, // Valor da compra
      }),
    });

    if (resposta.ok) {
      alert("Pagamento aprovado! Seu pedido já está no nosso sistema.");

      // Limpa a mochila do cliente
      localStorage.removeItem("carrinho");

      // Manda o cliente de volta pra loja
      window.location.href = "index.html";
    } else {
      alert("Ops! Tivemos um problema ao processar seu pedido no servidor.");
    }
  } catch (erro) {
    console.error("Erro de conexão:", erro);
    alert("Erro ao conectar com o sistema de vendas.");
  }
}
