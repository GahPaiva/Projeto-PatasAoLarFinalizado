// ================================
// MODAL DOS PETS
// ================================

function configurarModais() {
  const modal = document.getElementById("pet-modal");

  const fecharModal = document.querySelector(".fechar-modal");

  if (!modal || !fecharModal) {
    return;
  }

  // Abre o modal ao clicar no card

  document.querySelectorAll(".pet-card-dinamico").forEach(function (card) {
    card.addEventListener("click", function (event) {
      // Não abre o modal ao clicar no botão Quero Adotar

      if (event.target.classList.contains("btn-adotar")) {
        return;
      }

      // Pega o ID do pet

      const idPet = Number(card.dataset.id);
      window.petAtualId = idPet;

      // Procura o pet que veio do banco

      const pet = petsSalvos.find(function (item) {
        return item.id === idPet;
      });

      // Se não encontrou, não faz nada

      if (!pet) {
        return;
      }

      // ================================
      // PREENCHER MODAL
      // ================================

      document.getElementById("modal-foto").src = pet.foto;

      document.getElementById("modal-foto").alt = pet.nome;

      document.getElementById("modal-nome").textContent = pet.nome;

      document.getElementById("modal-idade").textContent = pet.idade;

      document.getElementById("modal-fase").textContent = pet.fase;

      document.getElementById("modal-porte").textContent = pet.porte;

      document.getElementById("modal-especie").textContent = pet.especie;

      document.getElementById("modal-raca").textContent = pet.raca;

      document.getElementById("modal-descricao").textContent = pet.descricao;

      document.getElementById("modal-castrado").textContent = pet.castrado
        ? "Sim"
        : "Não";

      document.getElementById("modal-vacinado").textContent = pet.vacinado
        ? "Sim"
        : "Não";

      document.getElementById("modal-pelagem").textContent = pet.pelagem;

      // ================================
      // CONVIVÊNCIA
      // ================================

      document.getElementById("modal-convivencia").textContent = Array.isArray(
        pet.convivencia,
      )
        ? pet.convivencia.join(", ")
        : "Não informado";

      // ================================
      // SEXO
      // ================================

      const modalSexo = document.getElementById("modal-sexo");

      if (pet.sexo.toLowerCase() === "macho") {
        modalSexo.innerHTML = '<i class="fa-solid fa-mars"></i>';
      } else {
        modalSexo.innerHTML = '<i class="fa-solid fa-venus"></i>';
      }

      // ================================
      // PERSONALIDADES
      // ================================

      const personalidadeContainer = document.getElementById(
        "modal-personalidades",
      );

      personalidadeContainer.innerHTML = "";

      // Como personalidade ainda não está
      // no banco, só cria as tags se existirem

      if (Array.isArray(pet.personalidades)) {
        pet.personalidades.forEach(function (personalidade, index) {
          const tag = document.createElement("p");

          tag.textContent = personalidade;

          const cores = [
            "personalidade-rosa",
            "personalidade-amarelo",
            "personalidade-azul",
            "personalidade-roxo",
          ];

          tag.classList.add(cores[index % cores.length]);

          personalidadeContainer.appendChild(tag);
        });
      }

      // ================================
      // ABRIR MODAL
      // ================================

      modal.style.display = "flex";

      document.body.classList.add("modal-aberto");
    });
  });
}

// ================================
// FECHAR MODAL
// ================================

const modal = document.getElementById("pet-modal");

const fecharModal = document.querySelector(".fechar-modal");

if (fecharModal && modal) {
  fecharModal.addEventListener("click", function () {
    modal.style.display = "none";

    document.body.classList.remove("modal-aberto");
  });

  // Fecha clicando fora do conteúdo

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";

      document.body.classList.remove("modal-aberto");
    }
  });
}

// ================================
// FAVORITO
// ================================

const botaoFavorito = document.querySelector(".btn-favorito");

if (botaoFavorito) {
  botaoFavorito.onclick = function () {
    const icone = this.querySelector("i");

    this.classList.toggle("ativo");

    icone.classList.toggle("fa-regular");

    icone.classList.toggle("fa-solid");
  };
}

// ================================
// INICIAR
// ================================

carregarPets();

// BOTÃO QUERO ADOTAR DO MODAL

const botaoAdotarModal = document.querySelector(".modal-adotar");

botaoAdotarModal.addEventListener("click", function () {

    const nomeAnimal = document.getElementById("modal-nome").textContent;

    const mensagem = `Olá! Tenho interesse em adotar o ${nomeAnimal}. Gostaria de saber mais informações sobre ele.`;

    const linkWhatsApp =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(linkWhatsApp, "_blank");

});

// ================================
// BOTÃO COMPARTILHAR
// ================================

const botaoCompartilhar =
  document.querySelector(".modal-compartilhar");

if (botaoCompartilhar) {
  botaoCompartilhar.addEventListener("click", async function () {

    const nomeAnimal =
      document.getElementById("modal-nome").textContent;

    // Pega o ID do pet que está aberto
    const idPet = window.petAtualId;

    if (!idPet) {
      alert("Não foi possível identificar este animal.");
      return;
    }

    // Cria o link específico do pet
    const urlPagina =
      `${window.location.origin}${window.location.pathname}?id=${idPet}`;

    const textoCompartilhar =
      `Conheça o ${nomeAnimal} e veja como adotá-lo! 🐾`;

    // ================================
    // CELULAR / NAVEGADOR COM SHARE
    // ================================

    if (navigator.share) {

      try {

        await navigator.share({
          title: `Adote o ${nomeAnimal}`,
          text: textoCompartilhar,
          url: urlPagina
        });

      } catch (erro) {

        console.log("Compartilhamento cancelado.");

      }

    } else {

      // ================================
      // COMPUTADOR
      // ================================

      try {

        await navigator.clipboard.writeText(urlPagina);

        alert(
          "Link do " +
          nomeAnimal +
          " copiado! 🐾"
        );

      } catch (erro) {

        alert("Não foi possível copiar o link.");

      }
    }
  });
}

// ================================
// ABRIR PET PELO LINK
// ================================

function abrirPetDoLink() {

  const parametros =
    new URLSearchParams(window.location.search);

  const idPet = Number(parametros.get("id"));

  if (!idPet) {
    return;
  }

  const card = document.querySelector(
    `.pet-card-dinamico[data-id="${idPet}"]`
  );

  if (!card) {
    return;
  }

  // Simula o clique no card
  card.click();
}