window.onload = () => {
  renderizarCarrinho();
};

// 1. FUNÇÃO QUE DESENHA A TELA E CALCULA O TOTAL
function renderizarCarrinho() {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  const carrinhoDeCompras = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  
  // Agora aponta para o <tbody> da nossa tabela
  const tbodyLista = document.getElementById("listaCarrinho");
  const elementoTotal = document.getElementById("valorTotal");

  // Se o carrinho estiver vazio, desenhamos uma linha ocupando todas as 3 colunas
  if (carrinhoDeCompras.length === 0) {
    tbodyLista.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; padding: 30px; color: var(--texto-mutado);">
          Sua mochila está vazia! Vá até a vitrine e escolha seus hardwares.
        </td>
      </tr>
    `;
    elementoTotal.innerText = "Total: R$ 0.00";
    return;
  }

  let htmlItens = "";
  let somaTotal = 0;

  // Passa por cada produto na mochila
  carrinhoDeCompras.forEach((produto, index) => {
    htmlItens += `
      <tr>
        <td>
          <div class="item-info">
            <img src="${produto.imagem || 'https://via.placeholder.com/60/0F172A/06B6D4?text=TechStore'}" alt="${produto.nome}">
            <span>${produto.nome}</span>
          </div>
        </td>
        <td style="font-weight: bold; color: var(--cor-primaria);">
          R$ ${parseFloat(produto.preco).toFixed(2)}
        </td>
        <td>
          <button class="btn-remover" onclick="removerDoCarrinho(${index})">
            X Remover
          </button>
        </td>
      </tr>
    `;
    // Transforma o texto do preço em número decimal e soma
    somaTotal += parseFloat(produto.preco);
  });

  // Atualiza a tela com as linhas da tabela e o valor total formatado
  tbodyLista.innerHTML = htmlItens;
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

  // primeira verificacao Carrinho vazio
  if (carrinhoDeCompras.length === 0) {
    alert("Coloque produtos no carrinho antes de tentar pagar!");
    return;
  }

  // segunda verificacaoUsuário não logado
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