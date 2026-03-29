const express = require('express');
const router = express.Router(); // cria um mini servidor e rotas

const { listarProdutos, 
        buscarProdutoPorId, 
        criarProdutos, 
        atualizarProduto, 
        deletarProduto
} = require('../controllers/produtosController'); // importa o controler


router.get('/produtos', listarProdutos); // define uma rota
router.get('/produtos/:id', buscarProdutoPorId);
router.post('/produtos', criarProdutos);
router.put('produtos/:id', atualizarProduto);
router.delete('produtos/:id', deletarProduto);

module.exports = router;