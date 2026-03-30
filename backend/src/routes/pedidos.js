const express = require('express');
const router = express.Router(); // cria um mini servidor e rotas

const { criarPedido, adicionarItemPedido, listarPedidos
} = require('../controllers/pedidosController'); // importa o controler

router.post('/pedidos', criarPedido);
router.post('/pedidos/:pedido_id/itens', adicionarItemPedido);
router.get('/pedidos',listarPedidos)

module.exports = router;