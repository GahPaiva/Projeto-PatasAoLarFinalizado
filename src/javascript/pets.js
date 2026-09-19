// ================================
// BUSCAR PETS DO BANCO DE DADOS
// ================================

let petsSalvos = [];

// Busca os pets através da API
async function carregarPets() {
  try {
    const resposta = await fetch("http://localhost:3000/pets");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar os pets.");
    }

    petsSalvos = await resposta.json();

    petsSalvos = petsSalvos.map(function (pet) {
      return {
        ...pet,

        convivencia: pet.convivencia
          ? pet.convivencia.split(",").map((item) => item.trim())
          : [],

        personalidades: pet.personalidades
          ? pet.personalidades.split(",").map((item) => item.trim())
          : [],
      };
    });

    criarCards();

    // Verifica se existe um pet no link
    abrirPetDoLink();
  } catch (erro) {
    console.error("Erro ao carregar pets:", erro);
  }
}

// ================================
// CRIAR CARDS
// ================================

function criarCards() {
  // Identifica o container da página

  const containerPets =
    document.getElementById("pets-container") ||
    document.getElementById("animais");

  // Se existir um container, cria os cards

  if (!containerPets) {
    return;
  }

  // Limpa os cards criados anteriormente

  containerPets.querySelectorAll(".pet-card-dinamico").forEach(function (card) {
    card.remove();
  });

  petsSalvos.forEach(function (pet) {
    // Cria o card

    const card = document.createElement("div");

    card.classList.add("pet-card");
    card.classList.add("pet-card-dinamico");

    // Guarda o ID do pet

    card.dataset.id = pet.id;

    // Dados para os filtros

    card.dataset.nome = pet.nome.toLowerCase();

    card.dataset.especie = pet.especie.toLowerCase();

    card.dataset.sexo = pet.sexo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    card.dataset.idade = pet.fase.toLowerCase();

    card.dataset.porte = pet.porte
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // ================================
    // IMAGEM
    // ================================

    const imagem = document.createElement("img");

    imagem.src = pet.foto;

    imagem.alt = pet.nome;

    // ================================
    // INFORMAÇÕES
    // ================================

    const info = document.createElement("div");

    info.classList.add("pet-info");

    // Nome

    const nome = document.createElement("h3");

    nome.textContent = pet.nome;

    // ================================
    // DADOS
    // ================================

    const dados = document.createElement("div");

    dados.classList.add("pet-dados");

    // Idade

    const idade = document.createElement("span");

    idade.textContent = "🎂 " + pet.idade;

    // Sexo

    const sexo = document.createElement("span");

    if (pet.sexo === "Macho") {
      sexo.innerHTML = '<i class="fa-solid fa-mars"></i> Macho';
    } else {
      sexo.innerHTML = '<i class="fa-solid fa-venus"></i> Fêmea';
    }

    // Porte

    const porte = document.createElement("span");

    porte.textContent = "📏 " + pet.porte;

    // ================================
    // BOTÃO
    // ================================

    const botao = document.createElement("button");

    botao.classList.add("btn-adotar");

    botao.textContent = "Quero Adotar";

    // ================================
    // MONTA O CARD
    // ================================

    dados.appendChild(idade);

    dados.appendChild(sexo);

    dados.appendChild(porte);

    info.appendChild(nome);

    info.appendChild(dados);

    info.appendChild(botao);

    card.appendChild(imagem);

    card.appendChild(info);

    // Coloca o novo pet NO COMEÇO

    containerPets.insertBefore(card, containerPets.firstChild);
  });

  // ================================
  // INDEX → MÁXIMO DE 6 CARDS
  // ================================

  if (document.getElementById("pets-container")) {
    const cards = containerPets.querySelectorAll(".pet-card-dinamico");

    cards.forEach(function (card, index) {
      if (index >= 6) {
        card.style.display = "none";
      }
    });
  }

  // Depois que os cards foram criados,
  // configura os eventos dos modais

  configurarModais();

  if (typeof filtrarAnimais === "function") {
    filtrarAnimais();
  }
}

// ================================
// QUERO ADOTAR - WHATSAPP
// ================================

const numeroWhatsApp = "5512988273044";

document.addEventListener("click", function (event) {
  const botao = event.target.closest(".btn-adotar");

  if (!botao) {
    return;
  }

  const card = botao.closest(".pet-card");

  if (!card) {
    return;
  }

  // Tenta pegar o nome pelo data-nome
  // Caso seja um card fixo da página inicial,
  // pega o nome diretamente do h3
  const nomeAnimal =
    card.dataset.nome || card.querySelector("h3")?.textContent.trim();

  if (!nomeAnimal) {
    return;
  }

  const mensagem = `Olá! Tenho interesse em adotar o ${nomeAnimal}. Gostaria de saber mais informações sobre ele.`;

  const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  window.open(linkWhatsApp, "_blank");
});
