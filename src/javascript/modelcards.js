// ========================================
// MODAL DO THOR
// ========================================

const cardThor = document.querySelector('.pet-card');
const modalThor = document.getElementById('modal-thor');
const fecharModal = document.querySelector('.fechar-modal');
const header = document.querySelector('.header');


// ========================================
// ABRIR O MODAL
// ========================================

cardThor.addEventListener('click', function(event) {

    // Não abre o modal se clicar no botão "Quero Adotar"
    if (event.target.classList.contains('btn-adotar')) {
        return;
    }

    modalThor.style.display = 'flex';

    // Esconde o header
    header.style.display = 'none';

});


// ========================================
// FECHAR PELO X
// ========================================

fecharModal.addEventListener('click', function() {

    modalThor.style.display = 'none';

    // Mostra o header novamente
    header.style.display = '';

});


// ========================================
// FECHAR CLICANDO FORA DO MODAL
// ========================================

modalThor.addEventListener('click', function(event) {

    if (event.target === modalThor) {

        modalThor.style.display = 'none';

        // Mostra o header novamente
        header.style.display = '';

    }

});


// ========================================
// FAVORITAR
// ========================================

const botoesFavorito = document.querySelectorAll('.btn-favorito');

botoesFavorito.forEach(function(botao) {

    botao.addEventListener('click', function() {

        const icone = this.querySelector('i');

        this.classList.toggle('ativo');

        icone.classList.toggle('fa-regular');
        icone.classList.toggle('fa-solid');

    });

});