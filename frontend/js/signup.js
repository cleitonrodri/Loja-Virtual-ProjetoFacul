document
  .getElementById("formSignup")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Trava a página

    const nome = document.getElementById("nomeSignup").value;
    const email = document.getElementById("emailSignup").value;
    const senha = document.getElementById("senhaSignup").value;

    // Bate na rota de criar usuários no Node.js
    const resposta = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome, email: email, senha: senha }),
    });

    if (resposta.status === 201) {
      alert("Conta criada com sucesso! Faça seu login.");

      // Como agora são páginas separadas, a gente joga o usuario pra página de login
      window.location.href = "signin.html";
    } else {
      alert("Erro ao criar conta. Esse e-mail já pode estar em uso.");
    }
  });
