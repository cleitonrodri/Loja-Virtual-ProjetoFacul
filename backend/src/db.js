
require('dotenv').config();

// criando uma variavel mysql e importando a biblioteca de mysql
const mysql = require('mysql2');

// criando conexão com o banco
const db = mysql.createConnection({
    host: process.env.DB_HOST, // onde o banco está, no caso meu note
    user: process.env.DB_USER, // usuario do mysql padrao 
    password: process.env.DB_PASSWORD, // a senha do banco de dados
    database: process.env.DB_NAME //nome do nosso banco criado
});

// conectando ao banco, criado um if pra caso de algum erro aparecer o erro.
db.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar com o Banco de Dados:' + erro);
        return;
    }
    console.log('Conectado ao MySQL 🚀');
});

// permite usarmos está conecão em outros arquivos
module.exports = db;