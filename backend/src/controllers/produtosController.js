const db = require('../db');


const criarProdutos = (req, res) => {
    
    const { nome, preco, descricao } = req.body; 
    
    db.query(
        'INSERT INTO produtos (nome, preco, descricao) VALUES (?, ?, ?)',
        [nome, preco, descricao], // substitui os ? pelos valores
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

const listarProdutos = (req, res) => {
    const sql = 'SELECT * FROM produtos';

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

const atualizarProduto = (req, res) => {

    // pega o id da URL
    const id = req.params.id;

    // pega os dados novos enviados
    const { nome, preco, descricao } = req.body;

    // atualiza no banco
    db.query(
        'UPDATE produtos SET nome = ?, preco = ?, descricao = ? WHERE id = ?',
        [nome, preco, descricao, id],
        (erro, results) => {

            if (erro) {
                console.error(erro);
                return res.status(500).send('Erro ao atualizar produto' + erro);
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
    criarProdutos,
    listarProdutos,
    buscarProdutoPorId, 
    atualizarProduto,
    deletarProduto
    };