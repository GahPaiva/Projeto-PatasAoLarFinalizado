console.log("ANIMAIS.JS CARREGOU");

let pets = [];

const listaAnimais = document.getElementById("lista-animais");
const contadorAnimais = document.getElementById("contador-animais");
const semAnimais = document.getElementById("sem-animais");

const modalExcluir = document.getElementById("modal-excluir");
const mensagemExcluir = document.getElementById("mensagem-excluir");
const cancelarExclusao = document.getElementById("cancelar-exclusao");
const confirmarExclusao = document.getElementById("confirmar-exclusao");

const modalMensagem = document.getElementById("modal-mensagem");
const tituloMensagem = document.getElementById("titulo-mensagem");
const textoMensagem = document.getElementById("texto-mensagem");
const fecharMensagem = document.getElementById("fechar-mensagem");

let petParaExcluir = null;

// ================================
// BUSCAR PETS
// ================================

async function carregarPets() {
  try {
    const resposta = await fetch("https://patas-ao-lar-api.vercel.app/pets");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar os animais.");
    }

    pets = await resposta.json();

    mostrarPets();
  } catch (erro) {
    console.error("Erro ao carregar animais:", erro);

    contadorAnimais.textContent = "Erro ao carregar animais.";
  }
}

// ================================
// MOSTRAR PETS
// ================================

function mostrarPets() {
  listaAnimais.innerHTML = "";

  if (pets.length === 1) {
    contadorAnimais.textContent = "1 animal cadastrado";
  } else {
    contadorAnimais.textContent = `${pets.length} animais cadastrados`;
  }

  if (pets.length === 0) {
    semAnimais.style.display = "block";

    return;
  }

  semAnimais.style.display = "none";

  pets.forEach(function (pet) {
    const card = document.createElement("article");

    card.classList.add("admin-pet-card");

    card.innerHTML = `
    <div class="admin-pet-imagem">
        <img
            src="${pet.foto}"
            alt="${pet.nome}"
        >
    </div>

    <div class="admin-pet-lateral">

        <h3>${pet.nome}</h3>

        <div class="admin-pet-acoes">

            <button
                type="button"
                class="btn-ver"
                data-id="${pet.id}"
            >
                <i class="fa-solid fa-eye"></i>
                Visualizar
            </button>

            <button
                type="button"
                class="btn-editar"
                data-id="${pet.id}"
            >
                <i class="fa-solid fa-pen"></i>
                Editar
            </button>

            <button
                type="button"
                class="btn-excluir"
                data-id="${pet.id}"
            >
                <i class="fa-solid fa-trash"></i>
                Excluir
            </button>

        </div>

    </div>
`;

    listaAnimais.appendChild(card);
  });

  configurarBotoes();
}

// ================================
// BOTÕES
// ================================

function configurarBotoes() {
  // VISUALIZAR

  document.querySelectorAll(".btn-ver").forEach(function (botao) {
    botao.addEventListener("click", function () {
      const id = this.dataset.id;

      visualizarPet(id);
    });
  });

  // EDITAR

  document.querySelectorAll(".btn-editar").forEach(function (botao) {
    botao.addEventListener("click", function () {
      const id = this.dataset.id;

      window.location.href = `editar-pet.html?id=${id}`;
    });
  });

  // EXCLUIR

  document.querySelectorAll(".btn-excluir").forEach(function (botao) {
    botao.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const id = Number(botao.dataset.id);

      console.log("Botão excluir clicado:", id);

      abrirModalExcluir(id);
    });
  });
}

// ================================
// VISUALIZAR PET
// ================================

function visualizarPet(id) {
  const pet = pets.find(function (item) {
    return item.id === Number(id);
  });

  if (!pet) {
    return;
  }

  tituloMensagem.textContent = pet.nome;

  textoMensagem.textContent =
    `Espécie: ${pet.especie} • ` +
    `Idade: ${pet.idade} • ` +
    `Fase: ${pet.fase} • ` +
    `Raça: ${pet.raca} • ` +
    `Sexo: ${pet.sexo} • ` +
    `Porte: ${pet.porte}`;

  modalMensagem.style.display = "flex";
}

// ================================
// ABRIR MODAL DE EXCLUSÃO
// ================================

function abrirModalExcluir(id) {
  const pet = pets.find(function (item) {
    return item.id === id;
  });

  if (!pet) {
    return;
  }

  petParaExcluir = pet;

  mensagemExcluir.textContent = `Tem certeza que deseja excluir o pet "${pet.nome}"?`;

  modalExcluir.style.display = "flex";
}

// ================================
// FECHAR MODAL DE EXCLUSÃO
// ================================

function fecharModalExcluir() {
  petParaExcluir = null;

  modalExcluir.style.display = "none";
}

cancelarExclusao.addEventListener("click", fecharModalExcluir);

// ================================
// CONFIRMAR EXCLUSÃO
// ================================

confirmarExclusao.addEventListener("click", async function () {
  if (!petParaExcluir) {
    return;
  }

  const id = petParaExcluir.id;

  confirmarExclusao.disabled = true;

  confirmarExclusao.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Excluindo...
        `;

  try {
    const resposta = await fetch(
      `https://patas-ao-lar-api.vercel.app/pets/${id}`,
      {
        method: "DELETE",
      },
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao excluir o pet.");
    }

    fecharModalExcluir();

    mostrarMensagem(
      "Pet excluído",
      `"${petParaExcluir?.nome || "Pet"}" foi removido com sucesso.`,
    );

    await carregarPets();
  } catch (erro) {
    console.error("Erro ao excluir pet:", erro);

    fecharModalExcluir();

    mostrarMensagem("Não foi possível excluir", erro.message);
  } finally {
    confirmarExclusao.disabled = false;

    confirmarExclusao.innerHTML = `
                <i class="fa-solid fa-trash"></i>
                Excluir
            `;
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

// ================================
// FECHAR CLICANDO FORA
// ================================

modalExcluir.addEventListener("click", function (event) {
  if (event.target === modalExcluir) {
    fecharModalExcluir();
  }
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
