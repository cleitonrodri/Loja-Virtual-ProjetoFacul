// criando uma variavel mysql e importando a biblioteca de mysql
const mysql = require('mysql2');

// criando conexão com o banco
const connection = mysql.createConnection({
    host: 'localhost', // onde o banco está, no caso meu note
    user: 'root', // usuario do mysql padrao 
    password: 'Cleiton7', // a senha do banco de dados
    database: 'lojavirtual' //nome do nosso banco criado
});

// conectando ao banco, criado um if pra caso de algum erro aparecer o erro.
connection.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar com o Banco de Dados:' + erro);
        return;
    }
    console.log('Conectado ao MySQL 🚀');
});

// permite usarmos está conecão em outros arquivos
module.exports = connection;