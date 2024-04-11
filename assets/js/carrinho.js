let carrinho = [];
let total = 0.00;

function adicionarAoCarrinho(nome, preco) {
	carrinho.push({ nome: nome, preco: preco });
	total += preco;
	
	let carrinhoElement = document.getElementById("carrinho");
	let itemElement = document.createElement("li");
	itemElement.innerHTML = nome + " - R$" + preco.toFixed(2);
	carrinhoElement.appendChild(itemElement);
	
	let totalElement = document.getElementById("total");
	totalElement.innerHTML = total.toFixed(2);
}

function esvaziarCarrinho() {
	carrinho = [];
	total = 0.00;
	
	let carrinhoElement = document.getElementById("carrinho");
	carrinhoElement.innerHTML = "";
	
	let totalElement = document.getElementById("total");
	totalElement.innerHTML = total.toFixed(2);
}
