const formulario = document.getElementById("form-pet");

const modalSucesso = document.getElementById("modal-sucesso");
const fecharSucesso = document.getElementById("fechar-sucesso");

// ================================
// FECHAR MODAL DE SUCESSO
// ================================

fecharSucesso.addEventListener("click", function () {
  modalSucesso.style.display = "none";
});

// ================================
// CADASTRAR PET
// ================================

formulario.addEventListener("submit", async function (event) {
  event.preventDefault();

  // ================================
  // PEGA OS CAMPOS DO FORMULÁRIO
  // ================================

  const foto = document.getElementById("foto").files[0];

  const nome = document.getElementById("nome").value;
  const especie = document.getElementById("especie").value;
  const idade = document.getElementById("idade").value;
  const fase = document.getElementById("fase").value;
  const raca = document.getElementById("raca").value;
  const sexo = document.getElementById("sexo").value;
  const porte = document.getElementById("porte").value;
  const castrado = document.getElementById("castrado").value;
  const vacinado = document.getElementById("vacinado").value;
  const pelagem = document.getElementById("pelagem").value;
  const descricao = document.getElementById("descricao").value;

  // ================================
  // PEGA A CONVIVÊNCIA
  // ================================

  const convivencia = Array.from(
    document.querySelectorAll('input[name="convivencia"]:checked'),
  ).map(function (checkbox) {
    return checkbox.value;
  });

  // ================================
  // PEGA A PERSONALIDADE
  // ================================

  const personalidades = Array.from(
    document.querySelectorAll('input[name="personalidade"]:checked'),
  ).map(function (checkbox) {
    return checkbox.value;
  });

  // ================================
  // VERIFICA SE TEM FOTO
  // ================================

  if (!foto) {
    alert("Selecione uma foto para o pet.");

    return;
  }

  // ================================
  // CRIA O FORM DATA
  // ================================

  const dados = new FormData();

  dados.append("foto", foto);

  dados.append("nome", nome);
  dados.append("especie", especie);
  dados.append("idade", idade);
  dados.append("fase", fase);
  dados.append("raca", raca);
  dados.append("sexo", sexo);
  dados.append("porte", porte);

  dados.append("castrado", castrado === "Sim");

  dados.append("vacinado", vacinado === "Sim");

  dados.append("pelagem", pelagem);
  dados.append("descricao", descricao);

  dados.append("convivencia", convivencia.join(", "));

  dados.append("personalidades", personalidades.join(", "));

  // ================================
  // ENVIA PARA O BACKEND
  // ================================

  try {
    const resposta = await fetch("https://patas-ao-lar-api.vercel.app/pets", {
      method: "POST",
      body: dados,
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao cadastrar o pet.");
    }

    // ================================
    // SUCESSO
    // ================================

    formulario.reset();

    modalSucesso.style.display = "flex";

    console.log("Pet cadastrado:", resultado.pet);
  } catch (erro) {
    console.error("Erro ao cadastrar pet:", erro);

    alert("Não foi possível cadastrar o pet.");
  }
});
