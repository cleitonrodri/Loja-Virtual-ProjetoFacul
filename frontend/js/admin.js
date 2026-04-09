let usuarioLogado = null;

// 1. Segurança ver se o usuario ta logado
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
};

// 2. FUNÇÃO DA LISTA SUSPENSA de CATEGORIA (Fica solta aqui fora!)
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

  // PRIMEIRO: Descobrimos qual é a categoria real antes de mandar
  let categoriaFinal = document.getElementById("categoriaProduto").value;

  if (categoriaFinal === "nova_categoria") {
    categoriaFinal = document.getElementById("inputNovaCategoria").value;
  }

  // Validação para não deixar o admin salvar produto sem categoria
  if (!nome || !preco || !categoriaFinal) {
    alert("Preencha o nome, preço e escolha uma categoria!");
    return;
  }

  // SEGUNDO: O Garçom leva tudo (incluindo a categoria) pro Node.js
  const resposta = await fetch("http://localhost:3000/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: nome,
      preco: preco,
      descricao: descricao,
      categoria: categoriaFinal, // <- a categoria indo pro banco aqui!
      marca: document.getElementById("marcaProduto").value,
      estoque: document.getElementById("estoqueProduto").value,
      tipo: usuarioLogado.tipo,
    }),
  });

  // TERCEIRO: Verifica se deu certo
  if (resposta.ok) {
    alert("Produto cadastrado com sucesso no banco!");
    // Limpa a tela
    document.getElementById("nomeProduto").value = "";
    document.getElementById("precoProduto").value = "";
    document.getElementById("descProduto").value = "";
    document.getElementById("categoriaProduto").value = "";
    document.getElementById("inputNovaCategoria").style.display = "none";
  } else {
    alert("Erro ao salvar o produto no banco de dados.");
  }
}
