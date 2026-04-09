// O "Ouvinte" fica esperando o formulário ser enviado (submit)
document
  .getElementById("formSignin")
  .addEventListener("submit", async function (event) {
    // A trava de segurança para a página não recarregar
    event.preventDefault();

    const email = document.getElementById("emailSignin").value;
    const senha = document.getElementById("senhaSignin").value;

    const resposta = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: senha }),
    });

    if (resposta.ok) {
      const dadosDoUsuario = await resposta.json();
      localStorage.setItem("usuario", JSON.stringify(dadosDoUsuario));
      alert("Login feito com sucesso!");
      window.location.href = "index.html";
    } else {
      alert("E-mail ou senha incorretos!");
    }
  });
