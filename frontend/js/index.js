// O "Ouvinte" que roda quando a página abre
window.onload = () => {
  const usuarioSalvo = localStorage.getItem("usuario");

  // Verifica se o usuário existe e não está corrompido
  if (usuarioSalvo && usuarioSalvo !== "undefined") {
    try {
      const usuario = JSON.parse(usuarioSalvo);

      // 1. Muda o botão de "Login" para uma saudação
      const linkSignin = document.getElementById("linkSignin");
      linkSignin.innerText = `👤 Olá, ${usuario.nome}`;
      linkSignin.href = "#"; // Desativa o link de ir para a página de login

      // 2. Esconde o "Cadastre-se" e revela o "Sair"
      document.getElementById("linkSignup").style.display = "none";
      document.getElementById("btnSair").style.display = "inline-block";

      // Mostra o painel apenas para o admin!
      if (usuario.tipo === "admin") {
        const acoesDiv = document.querySelector(".acoes-usuario");
        // Injeta o botão HTML sem estilos inline (usando apenas a classe btn-admin)
        acoesDiv.insertAdjacentHTML(
          "afterbegin",
          '<a href="admin.html" class="btn-admin">⚙️ Painel Admin</a>',
        );
      }
    } catch (e) {
      console.error("Erro ao ler usuário", e);
    }
  }
};

// Função para deslogar o usuário
function fazerLogout() {
  localStorage.removeItem("usuario"); // Destrói o crachá de identificação
  location.reload(); // Dá um F5 automático para a tela voltar ao estado deslogado
}
