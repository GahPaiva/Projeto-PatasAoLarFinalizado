// =========================
// FUNDO COM PEGADAS
// =========================

const pawsBackground = document.querySelector('.paws-background');

if (pawsBackground) {

    function criarPegadas() {

        pawsBackground.innerHTML = '';

        const larguraTela = window.innerWidth;

        let quantidadePegadas;

        if (larguraTela < 500) {
            quantidadePegadas = 35;

        } else if (larguraTela < 800) {
            quantidadePegadas = 55;

        } else if (larguraTela < 1200) {
            quantidadePegadas = 75;

        } else {
            quantidadePegadas = 100;
        }

        const pegadas = [];

        for (let i = 0; i < quantidadePegadas; i++) {

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

                    return distancia < 7;
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

            let tamanho;

            if (larguraTela < 500) {
                tamanho = Math.random() * 8 + 7;

            } else if (larguraTela < 800) {
                tamanho = Math.random() * 10 + 8;

            } else {
                tamanho = Math.random() * 15 + 10;
            }

            paw.style.fontSize = tamanho + 'px';

            pawsBackground.appendChild(paw);
        }
    }

    criarPegadas();

    window.addEventListener('resize', criarPegadas);
}
