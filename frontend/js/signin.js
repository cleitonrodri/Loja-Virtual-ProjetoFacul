// Fica esperando o formulário ser enviado (submit)
document
  .getElementById("formSignin")
  .addEventListener("submit", async function (event) {
    // A trava de segurança para a página não recarregar
    event.preventDefault();

    // Captura o que o usuário digitou
    const email = document.getElementById("emailSignin").value;
    const senha = document.getElementById("senhaSignin").value;

    // Dispara a requisição para a rota de autenticação do Node.js
    const resposta = await fetch("http://localhost:3000/login", {
      method: "POST", // POST garante que a senha viaje oculta no 'body'
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: senha }),
    });

    // Se o backend devolver Status 200 (OK)
    if (resposta.ok) {
      const dadosDoUsuario = await resposta.json();

      // Salva o "crachá" (id, nome, tipo) na memória do navegador
      localStorage.setItem("usuario", JSON.stringify(dadosDoUsuario));

      alert("Login feito com sucesso!");
      window.location.href = "index.html"; // Redireciona para a home
    } else {
      alert("E-mail ou senha incorretos!"); // Se o backend devolver Status 401 (Não Autorizado)
    }
  });
