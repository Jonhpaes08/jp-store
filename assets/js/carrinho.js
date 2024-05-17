// Array para armazenar os itens do carrinho
let carrinho = [];

// Função para adicionar um item ao carrinho
function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    atualizarCarrinho();
}

// Função para atualizar o conteúdo do carrinho na página
function atualizarCarrinho() {
    const listaCarrinho = document.getElementById("itens-carrinho");
    const totalCarrinho = document.getElementById("total-carrinho");

    listaCarrinho.innerHTML = ""; // Limpa a lista
    let total = 0;

    for (let item of carrinho) {
        const li = document.createElement("li");
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
        listaCarrinho.appendChild(li);
        total += item.preco;
    }

    totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
}

// ... (resto do código JavaScript para manipular eventos de clique nos botões "Adicionar ao Carrinho" e "Finalizar Compra")
