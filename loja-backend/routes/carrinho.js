const express = require('express');
const router = express.Router(); // cria um mini servidor e rotas

const { criarCarrinho,
        adicionarProdutoCarrinho,
        listarCarrinho
} = require('../controllers/carrinhoController'); // importa o controler


router.post('/carrinho', criarCarrinho); // define uma rota
router.post('/carrinho/:carrinho_id/produto', adicionarProdutoCarrinho);
router.get('/carrinho/:carrinho_id', listarCarrinho);

module.exports = router;