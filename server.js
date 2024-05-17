const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

// Configuração da conexão com o MySQL (adaptada da imagem)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#08Jonhvmp2004', // Insira sua senha real aqui
    database: 'jp_store_db',
    port: 3307 // Porta alterada para 3307
});

// Configuração da sessão
app.use(session({
    secret: '#15042004#', // Substitua por uma chave secreta forte
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware para verificar se o usuário está logado
function verificarLogin(req, res, next) {
    if (req.session.usuario) {
        // Usuário logado, pode prosseguir
        next();
    } else {
        // Usuário não logado, redirecionar para a página de login
        res.redirect('/login');
    }
}

// Rota para a página de login
app.get('/login', (req, res) => {
    res.render('login');
});

// Rota para processar o login (POST)
app.post('/login/check', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(query, [email], async (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            const usuario = results[0];
            const senhaValida = await bcrypt.compare(password, usuario.senha);

            if (senhaValida) {
                // Autenticação bem-sucedida
                req.session.usuario = usuario; // Armazenar dados do usuário na sessão
                res.redirect('/');
            } else {
                res.render('login', { error: 'Email ou senha incorretos' });
            }
        } else {
            res.render('login', { error: 'Email ou senha incorretos' });
        }
    });
});

// Rota para a página principal (protegida)
app.get('/', verificarLogin, (req, res) => {
    res.render('index', { usuario: req.session.usuario }); // Passar dados do usuário para a view
});


// ... (rota para a página de cadastro) ...

// Rota para a página de logout
app.get('/logout', (req, res) => {
    req.session.destroy(); // Destruir a sessão
    res.redirect('/login'); // Redirecionar para a página de login
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});

app.use(express.static(path.join(__dirname, 'assets'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

