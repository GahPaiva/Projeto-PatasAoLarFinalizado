const express = require("express");
const cors = require("cors");
const path = require("path");
const supabase = require("./supabase");

const app = express();

const PORTA = 3000;

console.log("1 - Iniciando servidor...");

// Permite receber dados em JSON
app.use(express.json());
app.use(cors());

console.log("2 - Express configurado");

// Permite acessar os arquivos do site
app.use(
    express.static(path.join(__dirname, ".."))
);

console.log("3 - Arquivos do site configurados");

// Pasta onde ficam as imagens dos pets
app.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "uploads"))
);

console.log("4 - Uploads configurado");

// Rotas dos pets
console.log("5 - Carregando petsRoutes...");

const petsRoutes = require("./petsRoutes");

app.use("/pets", petsRoutes);

console.log("6 - petsRoutes carregado");

// Rotas do administrador
console.log("7 - Carregando adminRoutes...");

const adminRoutes = require("./adminRoutes");

app.use("/admin", adminRoutes);

console.log(
    "Rotas do admin:",
    adminRoutes.stack.map(rota => rota.route?.path)
);

console.log("8 - adminRoutes carregado");

// Rota de teste
app.get("/", (req, res) => {
    res.send("Patas ao Lar - Backend funcionando!");
});

console.log("9 - Rota principal configurada");

// Iniciar servidor
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
