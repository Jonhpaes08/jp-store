// Função para mostrar/ocultar o menu
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show-menu');
  }
  
  // Adicionar evento de clique ao botão de menu
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }
  
  // Fechar o menu ao clicar em um link
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
  
  // Função para alterar o background do header ao rolar
  function scrollHeader() {
    const header = document.getElementById('header');
    this.scrollY >= 50 ? header.classList.add('scroll-header') : header.classList.remove('scroll-header');
  }
  window.addEventListener('scroll', scrollHeader);
  
  // Swiper para depoimentos (Testimonial)
  new Swiper('.testimonial-swiper', {
    spaceBetween: 30,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  
  // Swiper para novos produtos (New)
  new Swiper('.new-swiper', {
    spaceBetween: 24,
    loop: true,
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  });
  
  // Função para marcar a seção ativa na barra de navegação
  function scrollActive() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
  
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 58;
      const sectionId = current.getAttribute('id');
  
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
      } else {
        document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
      }
    });
  }
  window.addEventListener('scroll', scrollActive);
  
  // Função para mostrar o botão "Scroll Up"
  function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll') : scrollUp.classList.remove('show-scroll');
  }
  window.addEventListener('scroll', scrollUp);
  
  // Função para mostrar/ocultar o carrinho
  function toggleCart() {
    const cart = document.getElementById('cart');
    cart.classList.toggle('show-cart');
  }
  
  // Adicionar evento de clique ao botão de carrinho
  const cartShop = document.getElementById('cart-shop');
  if (cartShop) {
    cartShop.addEventListener('click', toggleCart);
  }
  
  // Fechar o carrinho ao clicar no botão de fechar
  const cartClose = document.getElementById('cart-close');
  if (cartClose) {
    cartClose.addEventListener('click', toggleCart);
  }
  
  // Função para alternar o tema (escuro/claro)
  function toggleTheme() {
    const body = document.body;
    const themeButton = document.getElementById('theme-button');
  
    body.classList.toggle('dark-theme');
    themeButton.classList.toggle('bx-sun');
  
    // Salvar a preferência de tema no localStorage
    localStorage.setItem('selected-theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
  }
  
  // Adicionar evento de clique ao botão de tema
  const themeButton = document.getElementById('theme-button');
  if (themeButton) {
    themeButton.addEventListener('click', toggleTheme);
  }
  
  // Aplicar o tema salvo ao carregar a página
  const savedTheme = localStorage.getItem('selected-theme');
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    if (savedTheme === 'dark') {
      themeButton.classList.add('bx-sun');
    }
  }
  
  // Preloader
  function loader() {
    document.querySelector('.loader').style.display = 'none';
  }
  
  function fadeOut() {
    setInterval(loader, 2000);
  }
  window.onload = fadeOut;
  