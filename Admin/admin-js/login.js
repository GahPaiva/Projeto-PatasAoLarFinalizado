const formulario = document.getElementById("form-login");

const senha = document.getElementById("senha");

const mostrarSenha = document.getElementById("mostrar-senha");

const mensagemLogin = document.getElementById("mensagem-login");

// ================================
// MOSTRAR / OCULTAR SENHA
// ================================

mostrarSenha.addEventListener("click", function () {
  const icone = this.querySelector("i");

  if (senha.type === "password") {
    senha.type = "text";

    icone.classList.remove("fa-eye");
    icone.classList.add("fa-eye-slash");
  } else {
    senha.type = "password";

    icone.classList.remove("fa-eye-slash");
    icone.classList.add("fa-eye");
  }
});

// ================================
// LOGIN
// ================================

formulario.addEventListener("submit", async function (event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();

  const senhaDigitada = senha.value;

  mensagemLogin.textContent = "";

  try {
    console.log("Tentando fazer login...");
    console.log("Usuário:", usuario);

    const resposta = await fetch(
      "https://patas-ao-lar-api.vercel.app/admin/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          usuario: usuario,
          senha: senhaDigitada,
        }),
      },
    );

    // Pega a resposta como texto
    const texto = await resposta.text();

    console.log("==============================");
    console.log("STATUS:", resposta.status);
    console.log("URL:", resposta.url);
    console.log("RESPOSTA:", texto);
    console.log("==============================");

    // Se o servidor respondeu com erro
    if (!resposta.ok) {
      mensagemLogin.textContent =
        "⚠️ Usuário ou senha incorretos. Verifique seus dados e tente novamente.";

      mensagemLogin.style.display = "block";
      return;
    }

    // Tenta transformar em JSON
    let resultado;

    try {
      resultado = JSON.parse(texto);
    } catch (erro) {
      console.error("Resposta não é JSON:", texto);

      mensagemLogin.textContent = "O servidor respondeu de forma inesperada.";

      return;
    }

    // ================================
    // LOGIN REALIZADO
    // ================================

    if (resultado.sucesso) {
      console.log("Login realizado com sucesso!");

      // Marca que o administrador está logado
      sessionStorage.setItem("adminLogado", "true");

      window.location.href = "paginas/inicio.html";
    } else {
      mensagemLogin.textContent =
        resultado.mensagem || "Usuário ou senha incorretos.";
    }
  } catch (erro) {
    console.error("Erro no login:", erro);

    mensagemLogin.textContent = "Não foi possível conectar ao servidor.";
  }
});
