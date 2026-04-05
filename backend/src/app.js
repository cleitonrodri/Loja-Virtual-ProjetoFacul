const express = require('express'); //importando o express é um framework do backend
const app = express(); // aqui eu crio a aplicação, nosso servidor
const db = require('./db'); //importa a conexão com o bando de dados
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Permite que o servidor entenda JSON (dados enviados no body) 

const produtosRoutes = require('./routes/produtos'); // importa as rotas
app.use(produtosRoutes); // ativa as rotas no sistema

const pedidosRoutes = require('./routes/pedidos');
app.use(pedidosRoutes);

const usuariosRoutes = require('./routes/usuarios');
app.use(usuariosRoutes);

// rota principal, quando acessar http://localhost:3000/
app.get('/', (req, res) => { 
    res.send('Bem Vindos a Loja'); 
});

module.exports = app;
