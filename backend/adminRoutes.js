const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("./database");

const router = express.Router();

router.post("/login", async (req, res) => {

    console.log(">>> ROTA /admin/login FOI CHAMADA!");
    
    const { usuario, senha } = req.body;

    try {
        const resultado = await pool.query(
            "SELECT * FROM admin WHERE usuario = $1",
            [usuario]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Usuário ou senha incorretos."
            });
        }

        const admin = resultado.rows[0];

        const senhaCorreta = await bcrypt.compare(
            senha,
            admin.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Usuário ou senha incorretos."
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Login realizado com sucesso!"
        });

    } catch (erro) {
        console.error("Erro no login:", erro);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

module.exports = router;