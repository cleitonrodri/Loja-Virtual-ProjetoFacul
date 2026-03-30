const db = require('../db');

const criarPedido = (req, res) => {
    const { usuario_id } = req.body;

    db.query('INSERT INTO pedidos (usuario_id) VALUES (?)',
         [usuario_id],
         (erro, results) => { 
        
            if (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao criar pedido' + erro);
        }

        // Retorna os dados como JSON
        res.json({
            mensagem: 'Pedido criado',
            pedido_id: results.insertId
        });
    }); // Fechamento correto do db.query
};

const adicionarItemPedido = (req, res) => {

    const pedido_id = req.params.pedido_id;
    const { produto_id, quantidade } = req.body;

    // 1. buscar preço do produto
    db.query(
        'SELECT preco FROM produtos WHERE id = ?',
        [produto_id],
        (erro, result) => {

            if (erro) {
                console.error(erro);
                return res.status(500).send('Erro ao buscar produto' + erro);
            }
            if (result.length === 0) {
                    return res.status(404).send('Produto não encontrado');
                }
            const preco = result[0].preco;
               

            // 2. inserir item no pedido
            db.query(
                'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco) VALUES (?, ?, ?, ?)',
                [pedido_id, produto_id, quantidade, preco],
                (erro) => {

                    if (erro) {
                        console.error(erro);
                        return res.status(500).send('Erro ao adicionar item' + erro);
                    }

                    // 3. calcular total
                    const totalItem = preco * quantidade;

                    db.query(
                        'UPDATE pedidos SET total = total + ? WHERE id = ?',
                        [totalItem, pedido_id],
                        (erro) => {

                            if (erro) {
                                console.error(erro);
                                return res.status(500).send('Erro ao atualizar total' + erro);
                            }

                            res.send('Item adicionado e total atualizado');
                        });
                });
        });
};

const listarPedidos = (req, res) => {
    db.query(`
        SELECT
        pedidos.id,
        usuarios.nome AS usuario,
        pedidos.total,
        pedidos.data
        FROM  pedidos
        JOIN usuarios ON pedidos.usuario_id = usuarios.id
        `, (erro, results) => {
            if(erro){
                console.error(erro);
                return res.status(500).send('Erro ao listar pedidos' + erro);
            }
            res.json(results);
        });
};

module.exports = {
    criarPedido,
    adicionarItemPedido,
    listarPedidos
};