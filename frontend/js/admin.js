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
    // Usar display via JS aqui é aceitável pois é um comportamento de toggle direto
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

    // Troca de classe em vez de estilo inline
    const btn = document.getElementById("btnSalvarProduto");
    btn.innerText = "Salvar no Banco de Dados";
    btn.className = "btn-form btn-salvar";

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

    //Atualiza o Card de Clientes
    document.getElementById("cardTotalUsuarios").innerText = usuarios.length;

    let linhasHtml = "";
    usuarios.forEach((usuario) => {
      linhasHtml += `
        <tr>
          <td>${usuario.id}</td>
          <td>${usuario.nome}</td>
          <td>${usuario.email}</td>
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
    atualizarDropdownCategorias();

    // ATUALIZA O DASHBOARD
    document.getElementById("cardTotalProdutos").innerText = produtos.length;

    let linhasHtml = "";
    produtos.forEach((produto) => {
      // Converte o preço para número e formata com 2 casas decimais
      const precoFormatado = parseFloat(produto.preco).toFixed(2);

      linhasHtml += `
        <tr>
          <td>${produto.id}</td>
          <td>${produto.nome}</td>
          <td>${produto.categoria}</td>
          <td>R$ ${precoFormatado}</td>
          <td>${produto.estoque}</td>
          <td>
            <button class="btn-acao btn-editar" onclick="prepararEdicao(${produto.id})">✏️ Editar</button>
            <button class="btn-acao btn-excluir" onclick="deletarProduto(${produto.id})">🗑️ Excluir</button>
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

    //Faz a matemática do Faturamento
    let somaVendas = 0;
    pedidos.forEach((pedido) => {
      somaVendas += parseFloat(pedido.total);
    });
    document.getElementById("cardTotalVendas").innerText = `R$ ${somaVendas.toFixed(2)}`;

    let linhasHtml = "";
    pedidos.forEach((pedido) => {
      const totalFormatado = parseFloat(pedido.total).toFixed(2);

      // Converte a data do banco para o padrão DD/MM/AAAA
      const dataFormatada = new Date(pedido.data).toLocaleDateString("pt-BR");

      linhasHtml += `
        <tr>
          <td class="destaque-id">#${pedido.id}</td>
          <td>${pedido.usuario}</td> 
          <td>${dataFormatada}</td>
          <td class="destaque-valor">R$ ${totalFormatado}</td>
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
      carregarEstoque(); // recarrega a tabela automaticamente para a linha sumir
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
  btn.className = "btn-form btn-editar";

  // 5. Joga o usuário para a aba do formulário
  abrirAba("abaNovoProduto");
}

// 9. Função inteligente para atualizar a lista suspensa com dados do banco
function atualizarDropdownCategorias() {
  // 1. Categorias base para a loja nunca ficar vazia, mesmo se zerar o estoque
  const categoriasBase = ["teclado", "mouse", "monitor", "placa-mae", "placa-video"];

  // 2. Extrai só os nomes das categorias de todos os produtos que vieram do banco
  const categoriasDoBanco = listaEstoqueGlobal.map((produto) => produto.categoria);

  // 3. Junta as duas listas e usa o 'Set' para arrancar todas as duplicatas
  const categoriasUnicas = [...new Set([...categoriasBase, ...categoriasDoBanco])];

  // 4. Começa a montar o HTML da lista suspensa
  let opcoesHtml = `<option value="" disabled selected>Selecione uma categoria...</option>`;

  // 5. Cria uma <option> para cada categoria encontrada
  categoriasUnicas.forEach((categoria) => {
    // Coloca a primeira letra em maiúscula só pra ficar bonito na tela
    const nomeFormatado = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    opcoesHtml += `<option value="${categoria}">${nomeFormatado}</option>`;
  });

  // 6. Coloca a opção de Criar Nova fixada no final
  opcoesHtml += `<option value="nova_categoria">➕ Criar Nova Categoria...</option>`;

  // 7. Injeta o novo HTML limpo dentro do select do formulário
  document.getElementById("categoriaProduto").innerHTML = opcoesHtml;
}