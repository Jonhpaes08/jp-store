// ... (outras configurações)

app.get('/', (req, res) => {
    res.render('base', { body: 'index', title: 'Página Inicial' });
  });
  
  app.get('/carrinho', (req, res) => {
    res.render('base', { body: 'carrinho', title: 'Carrinho de Compras' });
  });
  