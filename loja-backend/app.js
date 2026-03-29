const express = require('express'); //importando o express é um framework do backend
const app = express(); // aqui eu crio a aplicação, nosso servidor
const db = require('./db'); //importa a conexão com o bando de dados

app.use(express.json()); // Permite que o servidor entenda JSON (dados enviados no body) 

const produtosRoutes = require('./routes/produtos'); // importa as rotas
app.use(produtosRoutes); // ativa as rotas no sistema

const carrinhoRoutes = require('./routes/carrinho');
app.use(carrinhoRoutes);

// rota principal, quando acessar http://localhost:3000/
app.get('/', (req, res) => { 
    res.send('Bem Vindos a Loja'); 
});


// inicia o servidor na porta 3000
app.listen(3000, () => { 
    console.log('Servidor rodando na porta 3000'); // mensagem só pra confirmar no terminal
});