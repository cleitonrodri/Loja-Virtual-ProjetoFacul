const db = require('../db');

const criarUsuario = (req, res) => {
   const { nome, email, senha } = req.body;

   db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?,?)',
    [nome, email, senha],
    (erro, result) => {

        if (erro) {
            console.error(erro);
         return res.status(500).send('Erro ao criar Usuario' + erro);
        }

        res.status(201).send('Usuario criado com sucesso');
    });
}

const listarUsuarios =  (req, res) => {

    db.query('SELECT id, nome, email FROM usuarios',
       (erro, results) => {

        if (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao buscar os Usuarios');
        }

        res.json(results);
       });
};

const buscarUsuariosPorId = (req, res) => {

    const id = req.params.id;

    db.query('SELECT id, nome, email FROM usuarios WHERE id = ?',
        [id],
        (erro, results) => {
            if (erro) {
                console.error(erro);
                return res.status(500).send('Erro ao buscar usuario');
            }
            if (results.length === 0) {
                return res.status(404).send('Usuario não encontrado');

            }
            res.json(results[0]);
        });
};

const atualizarUsuario = (req, res) => {
    const id = req.params.id;
    const { nome, email, senha } = req.body;

    db.query('UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?',
        [nome, email, senha, id],
        (erro, results) => {
            if (erro) {
                console.error(erro);
                return res.status(500).send('Erro ao atualizar usuario');
            }
            res.send('Usuario atualizado com sucesso');
        });
};

const deletarUsuario = (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM usuarios WHERE id = ?',
        [id],
        (erro, result) => {

            if (erro) {
                console.error(erro);
                return res.status(500).send('Erro ao deletar usuario')
            }
            res.send('Usuario deletado com sucesso');
        });
}

const login = (req, res) => {

    const {email, senha} = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', 
        [email, senha],
        (erro, results) => {
           
            if (results.length === 0) {
                return res.status(401).send('Usuário ou senha inválidos');
            }

            const usuario = results[0];

            res.json({
                id: usuario.id,
                nome: usuario.nome,
                tipo: usuario.tipo
            });
        });
};

module.exports = {
    criarUsuario,
    listarUsuarios,
    buscarUsuariosPorId,
    atualizarUsuario,
    deletarUsuario,
    login
};