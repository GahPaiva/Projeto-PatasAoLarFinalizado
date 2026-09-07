// ========================================
// PATINHAS - HEADER, COMO AJUDAR E FOOTER
// ========================================

const headerPaws = document.querySelector('.header .paws-background');
const ajudaPaws = document.querySelector('.paws-ajuda');
const footerPaws = document.querySelector('.paws-background-footer');


// ========================================
// CRIAR PEGADAS
// ========================================

function criarPegadas(container, tipo) {

    if (!container) return;

    container.innerHTML = '';

    const larguraTela = window.innerWidth;

    let quantidadePegadas;


    // ========================================
    // HEADER
    // ========================================

    if (tipo === 'header') {

        if (larguraTela < 500) {

            quantidadePegadas = 20;

        } else if (larguraTela < 800) {

            quantidadePegadas = 30;

        } else if (larguraTela < 1200) {

            quantidadePegadas = 45;

        } else {

            quantidadePegadas = 60;

        }

    }


    // ========================================
    // COMO AJUDAR
    // ========================================

    else if (tipo === 'ajuda') {

        if (larguraTela < 500) {

            quantidadePegadas = 30;

        } else if (larguraTela < 800) {

            quantidadePegadas = 100;

        } else if (larguraTela < 1200) {

            quantidadePegadas = 70;

        } else {

            quantidadePegadas = 100;

        }

    }


    // ========================================
    // FOOTER
    // ========================================

    else {

        if (larguraTela < 500) {

            quantidadePegadas = 30;

        } else if (larguraTela < 800) {

            quantidadePegadas = 60;

        } else if (larguraTela < 1200) {

            quantidadePegadas = 100;

        } else {

            quantidadePegadas = 120;

        }

    }


    const pegadas = [];


    // ========================================
    // CRIA AS PEGADAS
    // ========================================

    for (let i = 0; i < quantidadePegadas; i++) {

        let top;
        let left;

        let muitoPerto = true;

        let tentativas = 0;


        while (muitoPerto && tentativas < 100) {

            top = Math.random() * 90;
            left = Math.random() * 95;


            muitoPerto = pegadas.some(pegada => {

                const distanciaTop =
                    top - pegada.top;

                const distanciaLeft =
                    left - pegada.left;


                const distancia = Math.sqrt(
                    distanciaTop ** 2 +
                    distanciaLeft ** 2
                );


                return distancia < 8;

            });


            tentativas++;

        }


        pegadas.push({
            top: top,
            left: left
        });


        const paw = document.createElement('i');


        paw.classList.add(
            'fa-solid',
            'fa-paw',
            'paw'
        );


        paw.style.top = top + '%';
        paw.style.left = left + '%';


        // ========================================
        // TAMANHO
        // ========================================

        let tamanho;


        if (larguraTela < 500) {

            tamanho = Math.random() * 6 + 7;

        } else if (larguraTela < 800) {

            tamanho = Math.random() * 8 + 8;

        } else if (larguraTela < 1200) {

            tamanho = Math.random() * 10 + 9;

        } else {

            tamanho = Math.random() * 12 + 10;

        }


        paw.style.fontSize = tamanho + 'px';


        // ========================================
        // ROTAÇÃO
        // ========================================

        const rotacao =
            Math.random() * 40 - 20;

        paw.style.transform =
            `rotate(${rotacao}deg)`;


        container.appendChild(paw);

    }

}


// ========================================
// CRIAR TODAS AS PATINHAS
// ========================================

function criarTodasAsPegadas() {

    if (headerPaws) {
        criarPegadas(headerPaws, 'header');
    }

    if (ajudaPaws) {
        criarPegadas(ajudaPaws, 'ajuda');
    }

    if (footerPaws) {
        criarPegadas(footerPaws, 'footer');
    }

}


// ========================================
// INICIALIZA
// ========================================

criarTodasAsPegadas();


// ========================================
// ATUALIZA AO REDIMENSIONAR
// ========================================

window.addEventListener(
    'resize',
    criarTodasAsPegadas
);