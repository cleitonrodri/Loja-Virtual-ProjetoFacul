const express = require("express");
const router = express.Router(); // cria um mini servidor e rotas

const {
  criarUsuario,
  listarUsuarios,
  buscarUsuariosPorId,
  atualizarUsuario,
  deletarUsuario,
  login,
} = require("../controllers/usuariosController");

// ROTAS DE GESTÃO DE USUÁRIOS (CRUD)
router.post("/usuarios", criarUsuario);
router.get("/usuarios", listarUsuarios);
router.get("/usuarios/:id", buscarUsuariosPorId);
router.put("/usuarios/:id", atualizarUsuario);
router.delete("/usuarios/:id", deletarUsuario);

// ROTA DE AUTENTICAÇÃO (Login)
router.post("/login", login);

module.exports = router;
