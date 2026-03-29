const db = require('../db');

const criarCarrinho = (req, res) => {

    const { usuario_id } = req.body;

        db.query('INSERT INTO carrinhos (usuario_id) VALUES (?)', [usuario_id], (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao criar carrinho');
            }

            res.status(201).json({
                mensagem: 'Carrinho criado com sucesso',
                carrinho_id: results.insertId
            });
        });
};

const adicionarProdutoCarrinho = (req, res) => {
    
    const carrinho_id = req.params.carrinho_id;
    const { produto_id, quantidade } = req.body;

    db.query('INSERT INTO itens_carrinho (carrinho_id, produto_id, quantidade) VALUES (?, ?, ?)',
        [carrinho_id, produto_id, quantidade],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao adicionar produto no carrinho');
            }
            res.status(201).send('Produto adicionado ao carrinho');
        });
};

const listarCarrinho = (req, res) => { 

    const carrinho_id = req.params.carrinho_id;

    db.query(`SELECT produtos.nome AS produto, produtos.preco, itens_carrinho.quantidade, 
        (produtos.preco * itens_carrinho.quantidade) AS subtotal 
        FROM itens_carrinho 
        JOIN produtos ON itens_carrinho.produto_id = produtos.id 
        WHERE itens_carrinho.carrinho_id = ?`, 
                [carrinho_id], 
                (err, results) => {

                    if(err) {
                        console.error(err);
                        return res.status(500).send('Erro ao buscar carrinho');
                    }
                    res.json(results);
                });
            };

module.exports = {
    criarCarrinho,
    adicionarProdutoCarrinho,
    listarCarrinho
};