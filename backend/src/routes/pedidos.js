const express = require('express');
const router = express.Router(); // cria um mini servidor e rotas

const { criarPedido, adicionarItemPedido, listarPedidos, buscarPedidoCompleto
} = require('../controllers/pedidosController'); // importa o controler

router.post('/pedidos', criarPedido);
router.post('/pedidos/:pedido_id/itens', adicionarItemPedido);
router.get('/pedidos',listarPedidos);
router.get('/pedidos/:id',buscarPedidoCompleto);

module.exports = router;