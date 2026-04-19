let usuarioLogado = null;
let listaEstoqueGlobal = [];

// 1. Segurança ver se o usuario ta logado e inicialização das abas
window.onload = () => {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo || usuarioSalvo === "undefined") {
    alert("Acesso negado. Você precisa fazer login.");
    window.location.replace("signin.html");
    return;
  }

  usuarioLogado = JSON.parse(usuarioSalvo);

  if (usuarioLogado.tipo !== "admin") {
    alert("Acesso negado. Área restrita para administradores.");
    window.location.replace("index.html");
    return;
  }

  // Abre a aba de pedidos por padrão e carrega as listas
  abrirAba("abaPedidos");
  carregarUsuarios();
  carregarEstoque();
  carregarPedidos();
};

// 2. FUNÇÃO DA LISTA SUSPENSA de CATEGORIA
function verificarNovaCategoria() {
  const selectCategoria = document.getElementById("categoriaProduto");
  const inputNova = document.getElementById("inputNovaCategoria");

  if (selectCategoria.value === "nova_categoria") {
    inputNova.style.display = "block";
    inputNova.required = true;
  } else {
    inputNova.style.display = "none";
    inputNova.required = false;
    inputNova.value = "";
  }
}

// 3. FUNÇÃO DE CADASTRAR NO BANCO
async function cadastrarProduto() {
  const nome = document.getElementById("nomeProduto").value;
  const preco = document.getElementById("precoProduto").value;
  const descricao = document.getElementById("descProduto").value;

  let categoriaFinal = document.getElementById("categoriaProduto").value;

  if (categoriaFinal === "nova_categoria") {
    categoriaFinal = document.getElementById("inputNovaCategoria").value;
  }

  if (!nome || !preco || !categoriaFinal) {
    alert("Preencha o nome, preço e escolha uma categoria!");
    return;
  }

  // Olha pro campo invisível pra saber se estamos editando ou criando
  const idEditando = document.getElementById("idProdutoEditando").value;

  // Se tiver ID, a URL é a de atualizar. Se não, é a de criar.
  const url = idEditando
    ? `http://localhost:3000/produtos/${idEditando}`
    : "http://localhost:3000/produtos";
  const metodo = idEditando ? "PUT" : "POST";

  const resposta = await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: nome,
      preco: preco,
      descricao: descricao,
      categoria: categoriaFinal,
      marca: document.getElementById("marcaProduto").value,
      estoque: document.getElementById("estoqueProduto").value,
      tipo: usuarioLogado.tipo,
    }),
  });

  if (resposta.ok) {
    alert(
      idEditando
        ? "Produto atualizado com sucesso!"
        : "Produto cadastrado com sucesso!",
    );

    // Reseta o formulário para o modo "Criar"
    document.getElementById("idProdutoEditando").value = "";
    document.getElementById("tituloFormProduto").innerText =
      "Adicionar Novo Produto";
    const btn = document.getElementById("btnSalvarProduto");
    btn.innerText = "Salvar no Banco de Dados";
    btn.style.backgroundColor = "darkred";

    // Limpa os campos
    document.getElementById("nomeProduto").value = "";
    document.getElementById("precoProduto").value = "";
    document.getElementById("descProduto").value = "";
    document.getElementById("categoriaProduto").value = "";

    // Volta pra aba de estoque para ver a mudança
    carregarEstoque();
    abrirAba("abaEstoque");
  } else {
    alert("Erro ao salvar o produto.");
  }
}

// Função para alternar entre as telas do Painel Admin
function abrirAba(idDaAba) {
  const todasAsAbas = document.querySelectorAll(".conteudo-aba");

  todasAsAbas.forEach((aba) => {
    aba.style.display = "none";
  });

  document.getElementById(idDaAba).style.display = "block";
}

// 4. FUNÇÃO PARA LISTAR USUÁRIOS
async function carregarUsuarios() {
  try {
    const resposta = await fetch("http://localhost:3000/usuarios");
    const usuarios = await resposta.json();

    let linhasHtml = "";
    usuarios.forEach((usuario) => {
      linhasHtml += `
        <tr>
          <td style="padding: 8px;">${usuario.id}</td>
          <td style="padding: 8px;">${usuario.nome}</td>
          <td style="padding: 8px;">${usuario.email}</td>
        </tr>
      `;
    });

    document.getElementById("tabelaUsuarios").innerHTML = linhasHtml;
  } catch (erro) {
    console.error("Erro ao puxar usuários:", erro);
  }
}

// 5. FUNÇÃO PARA LISTAR ESTOQUE (PRODUTOS)
async function carregarEstoque() {
  try {
    const resposta = await fetch("http://localhost:3000/produtos");
    const produtos = await resposta.json();
    listaEstoqueGlobal = produtos; // Salva a lista na memória

    let linhasHtml = "";
    produtos.forEach((produto) => {
      // Converte o preço para número e formata com 2 casas decimais
      const precoFormatado = parseFloat(produto.preco).toFixed(2);

      linhasHtml += `
        <tr>
          <td style="padding: 8px;">${produto.id}</td>
          <td style="padding: 8px;">${produto.nome}</td>
          <td style="padding: 8px; text-transform: capitalize;">${produto.categoria}</td>
          <td style="padding: 8px;">R$ ${precoFormatado}</td>
          <td style="padding: 8px;">${produto.estoque}</td>
          <td style="padding: 8px;">
            <button onclick="prepararEdicao(${produto.id})" style="background-color: #f39c12; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; margin-right: 5px;">
              ✏️ Editar
            </button>
            <button onclick="deletarProduto(${produto.id})" style="background-color: #ff4c4c; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">
              🗑️ Excluir
            </button>
          </td>
        </tr>
      `;
    });

    document.getElementById("tabelaEstoque").innerHTML = linhasHtml;
  } catch (erro) {
    console.error("Erro ao puxar estoque:", erro);
  }
}

// 6. FUNÇÃO PARA LISTAR PEDIDOS (COM JOIN)
async function carregarPedidos() {
  try {
    const resposta = await fetch("http://localhost:3000/pedidos");
    const pedidos = await resposta.json();

    let linhasHtml = "";
    pedidos.forEach((pedido) => {
      const totalFormatado = parseFloat(pedido.total).toFixed(2);

      // Converte a data do banco para o padrão DD/MM/AAAA
      const dataFormatada = new Date(pedido.data).toLocaleDateString("pt-BR");

      linhasHtml += `
        <tr>
    <td style="padding: 8px; font-weight: bold;">#${pedido.id}</td>
    <td style="padding: 8px;">${pedido.usuario}</td> 
    <td style="padding: 8px;">${dataFormatada}</td>
    <td style="padding: 8px; color: green; font-weight: bold;">R$ ${totalFormatado}</td>
  </tr>
`;
    });

    document.getElementById("tabelaPedidos").innerHTML = linhasHtml;
  } catch (erro) {
    console.error("Erro ao puxar pedidos:", erro);
  }
}

// 7. FUNÇÃO PARA DELETAR PRODUTO
async function deletarProduto(id) {
  // Trava de segurança para evitar cliques acidentais
  const confirmacao = confirm(
    "Tem certeza que deseja excluir este produto do estoque?",
  );

  if (!confirmacao) {
    return; // Se o admin clicar em "Cancelar", a função para aqui.
  }

  try {
    // O fetch agora usa o método DELETE e passa o ID na URL
    const resposta = await fetch(`http://localhost:3000/produtos/${id}`, {
      method: "DELETE",
    });

    if (resposta.ok) {
      alert("Produto excluído com sucesso!");
      carregarEstoque(); // Mágica: recarrega a tabela automaticamente para a linha sumir
    } else {
      alert("Erro ao excluir o produto. Ele pode estar atrelado a um pedido.");
    }
  } catch (erro) {
    console.error("Erro de conexão:", erro);
  }
}

// 8. FUNÇÃO PARA PREPARAR A TELA DE EDIÇÃO
function prepararEdicao(id) {
  // 1. Procura o produto completo na nossa lista salva
  const produto = listaEstoqueGlobal.find((p) => p.id === id);

  // 2. Preenche os campos do formulário com os dados do banco
  document.getElementById("nomeProduto").value = produto.nome;
  document.getElementById("precoProduto").value = produto.preco;
  document.getElementById("descProduto").value = produto.descricao;
  document.getElementById("categoriaProduto").value = produto.categoria;
  document.getElementById("marcaProduto").value = produto.marca;
  document.getElementById("estoqueProduto").value = produto.estoque;

  // 3. Salva o ID no campo invisível
  document.getElementById("idProdutoEditando").value = produto.id;

  // 4. Muda a "cara" da tela para modo edição
  document.getElementById("tituloFormProduto").innerText =
    "✏️ Editar Produto #" + produto.id;
  const btn = document.getElementById("btnSalvarProduto");
  btn.innerText = "Atualizar Produto";
  btn.style.backgroundColor = "#f39c12";

  // 5. Joga o usuário para a aba do formulário
  abrirAba("abaNovoProduto");
}
