const db = require('../db');

const listarProdutos = (req, res) => {
    const sql = `
        SELECT produtos.id, produtos.nome, produtos.preco, 
               categorias.nome AS categoria, marcas.nome AS marca 
        FROM produtos 
        JOIN categorias ON produtos.categoria_id = categorias.id 
        JOIN marcas ON produtos.marca_id = marcas.id
    `;

    db.query(sql, (erro, results) => { 
        if (erro) {
            console.error(erro);
            return res.status(500).send('Erro no servidor' + erro);
        }

        // Retorna os dados como JSON
        res.json(results);
    }); // Fechamento correto do db.query
};

const buscarProdutoPorId = (req, res) => {
  // aqui ele pega o id que veio na URL (ex: /produtos/5)
    const id = req.params.id; 

    // aqui ele busca no banco o produto com esse id
    db.query('SELECT * FROM produtos WHERE id = ?', [id], (erro, results) => { 
        
        if (erro) {
            console.error(erro);
            return res.status(500).send('Erro no servidor' + erro);
        }

        // se não encontrar nenhum produto com esse id
        if (results.length === 0) {
            return res.status(404).send('Produto não encontrado');
        }

        // se encontrar, ele retorna apenas o produto encontrado
        res.json(results[0]);
    });

};

const criarProdutos = (req, res) => {
    
    const { nome, preco, descricao, categoria_id, marca_id } = req.body; 
    
    db.query(
        'INSERT INTO produtos (nome, preco, descricao, categoria_id, marca_id) VALUES (?, ?, ?, ?, ?)',
        [nome, preco, descricao, categoria_id, marca_id], // substitui os ? pelos valores
        (erro, result) => {

            if (erro) {
                console.error(erro);
                return res.status(500).send('Erro ao cadastrar produto' + erro);
            }

            // se deu certo
            res.status(201).send('Produto cadastrado com sucesso');
        }
);
}; 

const atualizarProduto = (req, res) => {

    // pega o id da URL
    const id = req.params.id;

    // pega os dados novos enviados
    const { nome, preco, descricao, categoria_id, marca_id } = req.body;

    // atualiza no banco
    db.query(
        'UPDATE produtos SET nome = ?, preco = ?, descricao = ?, categoria_id = ?, marca_id = ? WHERE id = ?',
        [nome, preco, descricao, categoria_id, marca_id, id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao atualizar produto');
            }

            // se não atualizou nada, o id não existe
            if (results.affectedRows === 0) {
                return res.status(404).send('Produto não encontrado');
            }

            // sucesso
            res.send('Produto atualizado com sucesso');
        }
    );
};

const deletarProduto = (req, res) => {

    // pega o id da URL
    const id = req.params.id;

    // deleta no banco o produto com esse id
    db.query('DELETE FROM produtos WHERE id = ?', [id], (erro, results) => {
      
        if (erro) {
            console.error(erro);
            return res.status(500).send('Erro no servidor' + erro);
        }

        // se não deletou nada, significa que o id não existe
        if (results.affectedRows === 0) {
            return res.status(404).send('Produto não encontrado');
        }
		
        // se deu certo
        res.send('Produto deletado com sucesso');
    });
};

module.exports = {
    listarProdutos,
    buscarProdutoPorId, 
    criarProdutos,
    atualizarProduto,
    deletarProduto
    };