window.onload = () => {
  renderizarCarrinho();
};

// Função que desenha a tela e calcula o total
function renderizarCarrinho() {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  const carrinhoDeCompras = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  const divLista = document.getElementById("listaCarrinho");
  const elementoTotal = document.getElementById("valorTotal");

  // Se o carrinho estiver vazio
  if (carrinhoDeCompras.length === 0) {
    divLista.innerHTML =
      "<p>Sua mochila está vazia! Vá até a vitrine e escolha seus hardwares.</p>";
    elementoTotal.innerText = "Total: R$ 0.00";
    return;
  }

  let htmlItens = "";
  let somaTotal = 0;

  // Passa por cada produto na mochila
  carrinhoDeCompras.forEach((produto, index) => {
    htmlItens += `
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0;">${produto.nome}</h4>
                    <p style="margin: 5px 0 0 0; color: gray;">R$ ${produto.preco}</p>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="background-color: #ff4c4c; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px;">
                    🗑️ Remover
                </button>
            </div>
        `;
    // Transforma o texto do preço em número e soma
    somaTotal += parseFloat(produto.preco);
  });

  // Atualiza a tela com o HTML e o valor total formatado
  divLista.innerHTML = htmlItens;
  elementoTotal.innerText = `Total: R$ ${somaTotal.toFixed(2)}`;
}

// Função para tirar um item específico da mochila
function removerDoCarrinho(posicaoDoItem) {
  let carrinhoDeCompras = JSON.parse(localStorage.getItem("carrinho"));

  // O .splice arranca o item daquela posição específica
  carrinhoDeCompras.splice(posicaoDoItem, 1);

  // Guarda a mochila atualizada no navegador
  localStorage.setItem("carrinho", JSON.stringify(carrinhoDeCompras));

  // Manda a tela se desenhar de novo para o item sumir da vista do cliente
  renderizarCarrinho();
}

// Função do Botão Finalizar Compra
function finalizarCompra() {
  const usuarioSalvo = localStorage.getItem("usuario");
  const carrinhoSalvo = localStorage.getItem("carrinho");
  const carrinhoDeCompras = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

  // Segurança 1: Tem coisa na mochila?
  if (carrinhoDeCompras.length === 0) {
    alert("Coloque produtos no carrinho antes de tentar pagar!");
    return;
  }

  // Segurança 2: O cara está logado? (Se não, manda pra tela de login)
  if (!usuarioSalvo || usuarioSalvo === "undefined") {
    alert("Você precisa entrar na sua conta para finalizar a compra.");
    window.location.href = "signin.html";
    return;
  }

  // Se passou pela segurança, festa! 🎉
  alert(
    "Pagamento aprovado! Seu pedido está sendo preparado. Parabéns pelo novo setup!",
  );

  // Esvazia a mochila depois de pagar
  localStorage.removeItem("carrinho");

  // Manda ele de volta pra Home
  window.location.href = "index.html";
}
