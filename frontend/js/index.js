// O "Ouvinte" que roda quando a página da Home abre
window.onload = () => {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (usuarioSalvo && usuarioSalvo !== "undefined") {
    try {
      const usuario = JSON.parse(usuarioSalvo);

      const linkSignin = document.getElementById("linkSignin");
      linkSignin.innerText = `👤 Olá, ${usuario.nome}`;
      linkSignin.href = "#";

      document.getElementById("linkSignup").style.display = "none";
      document.getElementById("btnSair").style.display = "inline-block";

      // Se for o chefe, mostra o botão do painel!
      if (usuario.tipo === "admin") {
        const acoesDiv = document.querySelector(".acoes-usuario");
        acoesDiv.insertAdjacentHTML(
          "afterbegin",
          '<a href="admin.html" class="btn-admin" style="margin-right: 10px;">⚙️ Painel Admin</a>',
        );
      }
    } catch (e) {
      console.error("Erro ao ler usuário", e);
    }
  }
};

// Função para deslogar o usuário
function fazerLogout() {
  localStorage.removeItem("usuario");
  location.reload();
}
