let pets = [];
let petSelecionado = null;

const listaPets = document.getElementById("lista-pets");
const editorPet = document.getElementById("editor-pet");
const nomePetEditor = document.getElementById("nome-pet-editor");
const formulario = document.getElementById("form-editar-pet");
const voltarLista = document.getElementById("voltar-lista");
const cancelarEdicao = document.getElementById("cancelar-edicao");
const mensagemEdicao = document.getElementById("mensagem-edicao");

const modalMensagem = document.getElementById("modal-mensagem");
const tituloMensagem = document.getElementById("titulo-mensagem");
const textoMensagem = document.getElementById("texto-mensagem");
const fecharMensagem = document.getElementById("fechar-mensagem");

// ================================
// BUSCAR PETS
// ================================

async function carregarPets() {
  try {
    const resposta = await fetch("http://localhost:3000/pets");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar os pets.");
    }

    pets = await resposta.json();

    mostrarPets();
  } catch (erro) {
    console.error("Erro ao carregar pets:", erro);

    listaPets.innerHTML = `
            <p>
                Não foi possível carregar os animais.
            </p>
        `;
  }
}

// ================================
// MOSTRAR PETS
// ================================

function mostrarPets() {
  listaPets.innerHTML = "";

  if (pets.length === 0) {
    listaPets.innerHTML = `
            <p>
                Nenhum animal cadastrado.
            </p>
        `;

    return;
  }

  pets.forEach(function (pet) {
    const card = document.createElement("article");

    card.classList.add("pet-editar-card");

    card.innerHTML = `
            <img
                src="${pet.foto}"
                alt="${pet.nome}"
            >

            <div class="pet-editar-info">

                <h3>
                    ${pet.nome}
                </h3>

                <p>
                    ${pet.especie} • ${pet.fase}
                </p>

                <button
                    type="button"
                    class="btn-editar-pet"
                    data-id="${pet.id}"
                >
                    <i class="fa-solid fa-pen"></i>
                    Editar
                </button>

            </div>
        `;

    listaPets.appendChild(card);
  });

  configurarBotoes();
}

// ================================
// BOTÕES
// ================================

function configurarBotoes() {
  document.querySelectorAll(".btn-editar-pet").forEach(function (botao) {
    botao.addEventListener("click", function () {
      const id = Number(this.dataset.id);

      abrirEditor(id);
    });
  });
}

// ================================
// ABRIR EDITOR
// ================================

function abrirEditor(id) {
  petSelecionado = pets.find(function (pet) {
    return pet.id === id;
  });

  if (!petSelecionado) {
    return;
  }

  nomePetEditor.textContent = petSelecionado.nome;

  document.getElementById("editar-nome").value = petSelecionado.nome;

  document.getElementById("editar-especie").value = petSelecionado.especie;

  document.getElementById("editar-idade").value = petSelecionado.idade;

  document.getElementById("editar-fase").value = petSelecionado.fase;

  document.getElementById("editar-raca").value = petSelecionado.raca;

  document.getElementById("editar-sexo").value = petSelecionado.sexo;

  document.getElementById("editar-porte").value = petSelecionado.porte;

  document.getElementById("editar-castrado").value = String(
    petSelecionado.castrado,
  );

  document.getElementById("editar-vacinado").value = String(
    petSelecionado.vacinado,
  );

  document.getElementById("editar-pelagem").value =
    petSelecionado.pelagem || "";

  document.getElementById("editar-descricao").value =
    petSelecionado.descricao || "";

  mensagemEdicao.textContent = "";

  listaPets.style.display = "none";

  editorPet.style.display = "block";
}

// ================================
// FECHAR EDITOR
// ================================

function fecharEditor() {
  petSelecionado = null;

  editorPet.style.display = "none";

  listaPets.style.display = "grid";

  formulario.reset();

  mensagemEdicao.textContent = "";
}

voltarLista.addEventListener("click", fecharEditor);

cancelarEdicao.addEventListener("click", fecharEditor);

// ================================
// SALVAR ALTERAÇÕES
// ================================

formulario.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!petSelecionado) {
    return;
  }

  const dados = new FormData();

  dados.append("nome", document.getElementById("editar-nome").value);

  dados.append("especie", document.getElementById("editar-especie").value);

  dados.append("idade", document.getElementById("editar-idade").value);

  dados.append("fase", document.getElementById("editar-fase").value);

  dados.append("raca", document.getElementById("editar-raca").value);

  dados.append("sexo", document.getElementById("editar-sexo").value);

  dados.append("porte", document.getElementById("editar-porte").value);

  dados.append(
    "castrado",
    document.getElementById("editar-castrado").value === "true",
  );

  dados.append(
    "vacinado",
    document.getElementById("editar-vacinado").value === "true",
  );

  dados.append("pelagem", document.getElementById("editar-pelagem").value);

  dados.append("descricao", document.getElementById("editar-descricao").value);

  dados.append(
    "convivencia",
    Array.isArray(petSelecionado.convivencia)
      ? petSelecionado.convivencia.join(", ")
      : petSelecionado.convivencia || "",
  );

  dados.append(
    "personalidades",
    Array.isArray(petSelecionado.personalidades)
      ? petSelecionado.personalidades.join(", ")
      : petSelecionado.personalidades || "",
  );

  const novaFoto = document.getElementById("editar-foto").files[0];

  if (novaFoto) {
    dados.append("foto", novaFoto);
  }

  try {
    mensagemEdicao.textContent = "Salvando alterações...";

    const resposta = await fetch(
      `http://localhost:3000/pets/${petSelecionado.id}`,
      {
        method: "PUT",
        body: dados,
      },
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao editar o pet.");
    }

    fecharEditor();

    mostrarMensagem(
      "Pet atualizado",
      "As informações do pet foram atualizadas com sucesso.",
    );

    await carregarPets();
  } catch (erro) {
    console.error("Erro ao editar pet:", erro);

    mostrarMensagem("Erro ao atualizar", erro.message);
  }
});

// ================================
// MODAL DE MENSAGEM
// ================================

function mostrarMensagem(titulo, texto) {
  tituloMensagem.textContent = titulo;

  textoMensagem.textContent = texto;

  modalMensagem.style.display = "flex";
}

fecharMensagem.addEventListener("click", function () {
  modalMensagem.style.display = "none";
});

modalMensagem.addEventListener("click", function (event) {
  if (event.target === modalMensagem) {
    modalMensagem.style.display = "none";
  }
});

// ================================
// INICIAR
// ================================

carregarPets();
