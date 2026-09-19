const express = require("express");
const multer = require("multer");
const supabase = require("./supabase");

const router = express.Router();

const pool = require("./database");

// ================================
// CONFIGURAÇÃO DO UPLOAD
// ================================

const upload = multer({
  storage: multer.memoryStorage(),
});

// ================================
// BUSCAR TODOS OS PETS
// ================================

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM pets");

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao buscar pets:", erro);

    res.status(500).json({
      erro: "Erro ao buscar pets",
    });
  }
});

// ================================
// CADASTRAR PET
// ================================

router.post("/", upload.single("foto"), async (req, res) => {
  try {
    const {
      nome,
      especie,
      idade,
      fase,
      raca,
      sexo,
      porte,
      castrado,
      vacinado,
      pelagem,
      descricao,
      convivencia,
      personalidades,
    } = req.body;

    // ================================
    // VERIFICA FOTO
    // ================================

    if (!req.file) {
      return res.status(400).json({
        erro: "A foto do pet é obrigatória.",
      });
    }

    // ================================
    // ENVIA FOTO PARA O SUPABASE STORAGE
    // ================================

    const extensao = req.file.originalname.split(".").pop().toLowerCase();

    const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extensao}`;

    const { error: erroUpload } = await supabase.storage
      .from("pets")
      .upload(nomeArquivo, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (erroUpload) {
      console.error("Erro ao enviar foto para o Supabase:", erroUpload);

      return res.status(500).json({
        erro: "Erro ao enviar a foto.",
      });
    }

    // ================================
    // PEGA URL PÚBLICA DA FOTO
    // ================================

    const { data: dadosUrl } = supabase.storage
      .from("pets")
      .getPublicUrl(nomeArquivo);

    const foto = dadosUrl.publicUrl;

    // ================================
    // INSERE NO BANCO
    // ================================

    const resultado = await pool.query(
      `INSERT INTO pets (
                    nome,
                    especie,
                    idade,
                    fase,
                    raca,
                    sexo,
                    porte,
                    castrado,
                    vacinado,
                    pelagem,
                    descricao,
                    foto,
                    convivencia,
                    personalidades
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10, $11, $12,
                    $13, $14
                )
                RETURNING *`,

      [
        nome,
        especie,
        idade,
        fase,
        raca,
        sexo,
        porte,
        castrado,
        vacinado,
        pelagem,
        descricao,
        foto,
        convivencia,
        personalidades,
      ],
    );

    res.status(201).json({
      mensagem: "Pet cadastrado com sucesso!",

      pet: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao cadastrar pet:", erro);

    res.status(500).json({
      erro: "Erro ao cadastrar pet",
    });
  }
});

// ================================
// EDITAR PET
// ================================

router.put("/:id", upload.single("foto"), async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        erro: "ID do pet inválido.",
      });
    }

    const {
      nome,
      especie,
      idade,
      fase,
      raca,
      sexo,
      porte,
      castrado,
      vacinado,
      pelagem,
      descricao,
      convivencia,
      personalidades,
    } = req.body;

    // ================================
    // BUSCA O PET ATUAL
    // ================================

    const petAtualResult = await pool.query(
      "SELECT * FROM pets WHERE id = $1",
      [id],
    );

    if (petAtualResult.rows.length === 0) {
      return res.status(404).json({
        erro: "Pet não encontrado.",
      });
    }

    const petAtual = petAtualResult.rows[0];

    // ================================
    // MANTÉM A FOTO ATUAL
    // ================================

    let foto = petAtual.foto;

    // ================================
    // SE ENVIOU UMA NOVA FOTO
    // ================================

    if (req.file) {
      // Descobre a extensão da imagem
      const extensao = req.file.originalname.split(".").pop().toLowerCase();

      // Cria um nome único para a nova foto
      const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extensao}`;

      // ================================
      // ENVIA A NOVA FOTO PARA O SUPABASE
      // ================================

      const { error: erroUpload } = await supabase.storage
        .from("pets")
        .upload(nomeArquivo, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (erroUpload) {
        console.error("Erro ao enviar nova foto para o Supabase:", erroUpload);

        return res.status(500).json({
          erro: "Erro ao enviar a nova foto.",
        });
      }

      // ================================
      // PEGA A URL PÚBLICA
      // ================================

      const { data: dadosUrl } = supabase.storage
        .from("pets")
        .getPublicUrl(nomeArquivo);

      foto = dadosUrl.publicUrl;

      // ================================
      // REMOVE A FOTO ANTIGA DO SUPABASE
      // ================================

      if (
        petAtual.foto &&
        petAtual.foto.includes("/storage/v1/object/public/pets/")
      ) {
        const caminhoFotoAntiga = petAtual.foto.split(
          "/storage/v1/object/public/pets/",
        )[1];

        if (caminhoFotoAntiga) {
          const { error: erroRemover } = await supabase.storage
            .from("pets")
            .remove([caminhoFotoAntiga]);

          if (erroRemover) {
            console.error("Erro ao remover foto antiga:", erroRemover);
          }
        }
      }
    }

    // ================================
    // ATUALIZA O BANCO DE DADOS
    // ================================

    const resultado = await pool.query(
      `UPDATE pets
       SET
          nome = $1,
          especie = $2,
          idade = $3,
          fase = $4,
          raca = $5,
          sexo = $6,
          porte = $7,
          castrado = $8,
          vacinado = $9,
          pelagem = $10,
          descricao = $11,
          foto = $12,
          convivencia = $13,
          personalidades = $14
       WHERE id = $15
       RETURNING *`,
      [
        nome,
        especie,
        idade,
        fase,
        raca,
        sexo,
        porte,
        castrado,
        vacinado,
        pelagem,
        descricao,
        foto,
        convivencia,
        personalidades,
        id,
      ],
    );

    // ================================
    // RESPOSTA
    // ================================

    res.json({
      mensagem: "Pet atualizado com sucesso!",
      pet: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao editar pet:", erro);

    res.status(500).json({
      erro: "Erro ao editar pet",
    });
  }
});

// ================================
// EXCLUIR PET
// ================================

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        erro: "ID do pet inválido.",
      });
    }

    // ================================
    // BUSCA O PET ANTES DE EXCLUIR
    // ================================

    const petResult = await pool.query("SELECT * FROM pets WHERE id = $1", [
      id,
    ]);

    if (petResult.rows.length === 0) {
      return res.status(404).json({
        erro: "Pet não encontrado.",
      });
    }

    const pet = petResult.rows[0];

    // ================================
    // EXCLUI O PET DO BANCO
    // ================================

    await pool.query("DELETE FROM pets WHERE id = $1", [id]);

    // ================================
    // REMOVE A FOTO DO SUPABASE
    // ================================

    if (pet.foto && pet.foto.includes("/storage/v1/object/public/pets/")) {
      const caminhoFoto = pet.foto.split("/storage/v1/object/public/pets/")[1];

      if (caminhoFoto) {
        const { error: erroRemover } = await supabase.storage
          .from("pets")
          .remove([caminhoFoto]);

        if (erroRemover) {
          console.error("Erro ao remover foto do Supabase:", erroRemover);
        }
      }
    }

    res.json({
      mensagem: "Pet excluído com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao excluir pet:", erro);

    res.status(500).json({
      erro: "Erro ao excluir pet",
    });
  }
});

module.exports = router;
