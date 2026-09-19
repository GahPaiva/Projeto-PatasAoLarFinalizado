require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => {
        console.log("Supabase PostgreSQL conectado com sucesso!");
    })
    .catch((erro) => {
        console.error(
            "Erro ao conectar no Supabase PostgreSQL:",
            erro.message
        );
    });

module.exports = pool;

