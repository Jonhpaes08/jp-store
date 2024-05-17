const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // Para analisar dados do formulário
const app = express();

// Simulação de banco de dados (substitua por um banco de dados real)
const usuarios = [
    { email: 'usuario1@email.com', senha: 'senha123' },
    // Adicione mais usuários aqui
];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: false })); // Middleware para analisar dados do formulário

// Rota para a página de login
app.get('/login', (req, res) => {
    res.render('login');
});

// Rota para processar o login (POST)
app.post('/login/check', (req, res) => {
    const { email, password } = req.body;

    const usuario = usuarios.find(u => u.email === email && u.senha === password);

    if (usuario) {
        // Autenticação bem-sucedida
        // Redirecione para a página principal ou faça o que for necessário
        res.redirect('/'); 
    } else {
        // Autenticação falhou
        res.render('login', { error: 'Email ou senha incorretos' });
    }
});

// Rota para a página principal (após o login)
app.get('/', (req, res) => {
    // Renderize a página principal (index.ejs)
    res.render('index'); 
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
