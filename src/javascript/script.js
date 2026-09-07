// ================================
// MENU DO HEADER
// ================================

const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");

menuBtn.addEventListener("click", function () {

    navMenu.classList.toggle("open");

    const icone = menuBtn.querySelector("i");

    if (navMenu.classList.contains("open")) {

        icone.classList.remove("fa-bars");
        icone.classList.add("fa-xmark");

    } else {

        icone.classList.remove("fa-xmark");
        icone.classList.add("fa-bars");

    }

});


// ================================
// LINKS DO MENU
// ================================

const sections = document.querySelectorAll("main section");
const navItems = document.querySelectorAll(".nav-item");

let isClickScrolling = false;


// Clique no menu

navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        // Fecha o menu no celular
        if (window.innerWidth <= 700) {

            navMenu.classList.remove("open");

            const icone = menuBtn.querySelector("i");

            icone.classList.remove("fa-xmark");
            icone.classList.add("fa-bars");

        }

    });


    const link = item;

    link.addEventListener("click", function () {

        isClickScrolling = true;

        navItems.forEach(function (navItem) {

            navItem.classList.remove("active");

        });

        item.classList.add("active");


        setTimeout(function () {

            isClickScrolling = false;

        }, 1000);

    });

});


// ================================
// DETECTA ROLAGEM
// ================================

window.addEventListener("scroll", function () {

    if (isClickScrolling) {
        return;
    }

    let current = "";

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 200) {

            current = section.id;

        }

    });


    navItems.forEach(function (item) {

        item.classList.remove("active");

        const href = item.getAttribute("href");

        if (href === "#" + current) {

            item.classList.add("active");

        }

    });

});

//-----SLIDES------

let contador = 1;

const radios = document.querySelectorAll('input[name="radio-btn"]');
const buttons = document.querySelectorAll('.manual-btn');

function atualizarBolinhas() {
    radios.forEach(function (radio, index) {
        if (radio.checked) {

            buttons.forEach(function (button) {
                button.classList.remove('active');
            });

            buttons[index].classList.add('active');
        }
    });
}

setInterval(function () {

    document.getElementById('radio' + contador).checked = true;

    atualizarBolinhas();

    contador++;

    if (contador > 2) {
        contador = 1;
    }

}, 5000);


radios.forEach(function (radio) {
    radio.addEventListener('change', atualizarBolinhas);
});

atualizarBolinhas();

// ----- MODAL SOBRE NÓS ------

const sobreLink = document.getElementById("sobre-link");
const sobreModal = document.getElementById("sobre-modal");
const fecharSobre = document.getElementById("fechar-sobre");

sobreLink.addEventListener("click", function (event) {
    event.preventDefault();

    sobreModal.style.display = "flex";
});

fecharSobre.addEventListener("click", function () {
    sobreModal.style.display = "none";
});
