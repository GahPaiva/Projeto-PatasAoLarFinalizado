// FILTRO

const pesquisa = document.getElementById("pesquisa");
const especie = document.getElementById("especie");
const sexo = document.getElementById("sexo");
const idade = document.getElementById("idade");
const porte = document.getElementById("porte");

const limparFiltros = document.getElementById("limpar-filtros");

const semResultados = document.getElementById("sem-resultados");


function filtrarAnimais() {

    const texto = pesquisa.value.toLowerCase().trim();

    let encontrou = 0;

    const cards = document.querySelectorAll(".pet-card");


    cards.forEach(card => {

        const nome = card.dataset.nome;
        const especieAnimal = card.dataset.especie;
        const sexoAnimal = card.dataset.sexo;
        const idadeAnimal = card.dataset.idade;
        const porteAnimal = card.dataset.porte;


        const combinaNome =
            nome.includes(texto);

        const combinaEspecie =
            especie.value === "todos" ||
            especieAnimal === especie.value;

        const combinaSexo =
            sexo.value === "todos" ||
            sexoAnimal === sexo.value;

        const combinaIdade =
            idade.value === "todos" ||
            idadeAnimal === idade.value;

        const combinaPorte =
            porte.value === "todos" ||
            porteAnimal === porte.value;


        if (
            combinaNome &&
            combinaEspecie &&
            combinaSexo &&
            combinaIdade &&
            combinaPorte
        ) {

            card.style.display = "";

            encontrou++;

        } else {

            card.style.display = "none";

        }

    });


    // CONTADOR

    const contador = document.getElementById("contador");

    if (contador) {

        if (encontrou === 0) {

            contador.textContent = "0 animais encontrados";

        } else if (encontrou === 1) {

            contador.textContent = "1 animal encontrado";

        } else {

            contador.textContent =
                `${encontrou} animais encontrados`;

        }

    }


    // SEM RESULTADOS

    if (encontrou > 0) {

        semResultados.style.display = "none";

    } else {

        semResultados.style.display = "block";

    }

}


// PESQUISA

pesquisa.addEventListener("input", filtrarAnimais);


// FILTROS

especie.addEventListener("change", filtrarAnimais);

sexo.addEventListener("change", filtrarAnimais);

idade.addEventListener("change", filtrarAnimais);

porte.addEventListener("change", filtrarAnimais);


// LIMPAR FILTROS

limparFiltros.addEventListener("click", function () {

    pesquisa.value = "";

    especie.value = "todos";

    sexo.value = "todos";

    idade.value = "todos";

    porte.value = "todos";

    filtrarAnimais();

});


// EXECUTA AO CARREGAR

filtrarAnimais();

// VEJA MAIS // 

const btnVejaMais = document.getElementById("btn-veja-mais");

const quantidadePorPagina = 8;
let quantidadeVisivel = quantidadePorPagina;


// FUNDO COM PATINHAS //

// 1º TRECHO — função que cria as patinhas //
function criarPegadas(container, quantidade, tamanhoMin, tamanhoMax) {

    if (!container) return;

    container.innerHTML = "";

    const pegadas = [];

    for (let i = 0; i < quantidade; i++) {

        let top;
        let left;
        let muitoPerto = true;
        let tentativas = 0;

        while (muitoPerto && tentativas < 100) {

            top = Math.random() * 95;
            left = Math.random() * 95;

            muitoPerto = pegadas.some(pegada => {

                const distanciaTop = top - pegada.top;
                const distanciaLeft = left - pegada.left;

                const distancia = Math.sqrt(
                    distanciaTop ** 2 +
                    distanciaLeft ** 2
                );

                return distancia < 5;
            });

            tentativas++;
        }

        pegadas.push({
            top: top,
            left: left
        });

        const paw = document.createElement("i");

        paw.classList.add(
            "fa-solid",
            "fa-paw",
            "paw"
        );

        paw.style.top = top + "%";
        paw.style.left = left + "%";

        const tamanho =
            Math.random() * (tamanhoMax - tamanhoMin) +
            tamanhoMin;

        paw.style.fontSize = tamanho + "px";

        // Apontadas para cima //
        paw.style.transform = "rotate(0deg)";

        container.appendChild(paw);
    }
}


// 2º TRECHO — usa a função no header e no footer //
function criarTodasAsPegadas() {

    const larguraTela = window.innerWidth;

    let quantidade;

    if (larguraTela < 500) {
        quantidade = 50;
    } else if (larguraTela < 800) {
        quantidade = 80;
    } else {
        quantidade = 100;
    }


    // HEADER
    const header = document.querySelector(".paws-background");

    criarPegadas(
        header,
        quantidade,
        8,
        28
    );


    // FOOTER
    const footer = document.querySelector(".paws-background-footer");

    criarPegadas(
        footer,
        quantidade,
        10,
        25
    );
}


criarTodasAsPegadas();

window.addEventListener(
    "resize",
    criarTodasAsPegadas
);