const bcrypt = require("bcrypt");
const pool = require("./database");

async function criarAdmin() {
    try {
        const usuario = "admin";

        // COLOQUE A NOVA SENHA AQUI
        const senha = "admin28";

        const senhaHash = await bcrypt.hash(senha, 10);

        await pool.query(
            "UPDATE admin SET senha = $1 WHERE usuario = $2",
            [senhaHash, usuario]
        );

        console.log("Senha do admin atualizada com sucesso!");

    } catch (erro) {

        console.error("Erro ao atualizar senha:", erro);

    } finally {

        await pool.end();

    }
}

criarAdmin();

