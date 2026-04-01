const express = require('express');
const router = express.Router(); // cria um mini servidor e rotas


const { criarUsuario, 
        listarUsuarios,
        buscarUsuariosPorId,
        atualizarUsuario,
        deletarUsuario
 } = require('../controllers/usuariosController');


router.post('/usuarios', criarUsuario);
router.get('/usuarios', listarUsuarios);
router.get('/usuarios/:id', buscarUsuariosPorId);
router.put('/usuarios/:id', atualizarUsuario);
router.delete('/usuarios/:id', deletarUsuario)

module.exports = router;