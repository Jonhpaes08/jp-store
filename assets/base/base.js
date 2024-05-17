// ... (configuração do servidor Node.js)

app.get('/', (req, res) => {
    res.render('base', { body: 'index' }); // Renderiza o index.html dentro do base.html
  });
  
  app.get('/carrinho', (req, res) => {
    res.render('base', { body: 'carrinho' }); // Renderiza o carrinho.html dentro do base.html
  });
  