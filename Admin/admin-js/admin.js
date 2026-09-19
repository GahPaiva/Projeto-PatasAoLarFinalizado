// ================================
// MENU LATERAL
// ================================

const sidebar = document.querySelector(".sidebar");

const botaoMenu = document.getElementById("botao-menu");


// ================================
// ABRIR / FECHAR MENU
// ================================

if (botaoMenu && sidebar) {

    botaoMenu.addEventListener("click", function () {

        sidebar.classList.toggle("menu-aberto");

    });

}


// ================================
// FECHAR MENU AO CLICAR EM UM LINK
// NO CELULAR
// ================================

if (sidebar) {

    const linksMenu =
        sidebar.querySelectorAll("a");


    linksMenu.forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 800) {

                sidebar.classList.remove(
                    "menu-aberto"
                );

            }

        });

    });

}