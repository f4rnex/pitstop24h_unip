if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

var totalAmount = "0,00"

function ready() {
  // Botão remover produto
  const removeCartProductButtons = document.getElementsByClassName("remove-product-button")
  for (var i = 0; i < removeCartProductButtons.length; i++) {
    removeCartProductButtons[i].addEventListener("click", removeProduct)
  }

  // Mudança valor dos inputs
  const quantityInputs = document.getElementsByClassName("product-qtd-input")
  for (var i = 0; i < quantityInputs.length; i++) {
    quantityInputs[i].addEventListener("change", checkIfInputIsNull)
  }

  // Botão add produto ao carrinho
  const addToCartButtons = document.getElementsByClassName("button-hover-background")
  for (var i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", addProductToCart)
  }

  // Botão comprar
  const purchaseButton = document.getElementsByClassName("purchase-button")[0]
  purchaseButton.addEventListener("click", makePurchase)
}

function removeProduct(event) {
  event.target.parentElement.parentElement.remove()
  updateTotal()
}

function checkIfInputIsNull(event) {
  if (event.target.value === "0") {
    event.target.parentElement.parentElement.remove()
  }

  updateTotal()
}

function addProductToCart(event) {
  const button = event.target
  const productInfos = button.parentElement.parentElement
  const productImage = productInfos.getElementsByClassName("product-image")[0].src
  const productName = productInfos.getElementsByClassName("product-title")[0].innerText
  const productPrice = productInfos.getElementsByClassName("product-price")[0].innerText

  const productsCartNames = document.getElementsByClassName("cart-product-title")
  for (var i = 0; i < productsCartNames.length; i++) {
    if (productsCartNames[i].innerText === productName) {
      productsCartNames[i].parentElement.parentElement.getElementsByClassName("product-qtd-input")[0].value++
      updateTotal()
      return
    }
  }

  let newCartProduct = document.createElement("tr")
  newCartProduct.classList.add("cart-product")

  newCartProduct.innerHTML =
    `
      <td class="product-identification">
        <img src="${productImage}" alt="${productName}" class="cart-product-image">
        <strong class="cart-product-title">${productName}</strong>
      </td>
      <td>
        <span class="cart-product-price">${productPrice}</span>
      </td>
      <td>
        <input type="number" value="1" min="0" class="product-qtd-input">
        <button type="button" class="remove-product-button">Remover</button>
      </td>
    `
  
  const tableBody = document.querySelector(".cart-table tbody")
  tableBody.append(newCartProduct)
  updateTotal()

  newCartProduct.getElementsByClassName("remove-product-button")[0].addEventListener("click", removeProduct)
  newCartProduct.getElementsByClassName("product-qtd-input")[0].addEventListener("change", checkIfInputIsNull)
}

function makePurchase() {
  if (totalAmount === "0,00") {
    alert("Seu carrinho está vazio!");
  } else {
    // Solicita CPF e endereço
    var nome = prompt("Insira seu nome completo")
    var cpf = prompt("Por favor, insira seu CPF:");
    var endereco = prompt("Por favor, insira seu endereço com bairro e referência:");
    var telefone = prompt("Insira seu telefone com DDD. Ex: 88912345678");

    // Exibe mensagem de agradecimento com CPF, endereço e telefone
    alert(
      `Nome ${nome}\n
      CPF: ${cpf}\n
      Endereço de entrega: ${endereco}\n
      Telefone onde entraremos em contato: ${telefone}`
    );

    // Janela de confirmação antes da compra
    var confirmacao = confirm("Deseja confirmar a compra?\n\n" + 
      `Valor do pedido: R$${totalAmount}`);

    if (confirmacao) {
      alert(
        `
        Obrigado pela sua compra!\n
        Nome: ${nome}\n
        CPF: ${cpf}\n
        Endereço de entrega: ${endereco}\n
        Telefone onde entraremos em contato: ${telefone}\n
        Valor do pedido: R$${totalAmount}\n
        Volte sempre :)
        `
      );

      document.querySelector(".cart-table tbody").innerHTML = "";
      updateTotal();
    } else {
      // Se o usuário cancelar, exibe uma mensagem de cancelamento
      alert("Pedido cancelado.");
    }
  }
}

// Atualizar o valor total do carrinho
function updateTotal() {
  const cartProducts = document.getElementsByClassName("cart-product")
  totalAmount = 0

  for (var i = 0; i < cartProducts.length; i++) {
    const productPrice = cartProducts[i].getElementsByClassName("cart-product-price")[0].innerText.replace("R$", "").replace(",", ".")
    const productQuantity = cartProducts[i].getElementsByClassName("product-qtd-input")[0].value

    totalAmount += productPrice * productQuantity
  }
  
  totalAmount = totalAmount.toFixed(2)
  totalAmount = totalAmount.replace(".", ",")
  document.querySelector(".cart-total-container span").innerText = "R$" + totalAmount
}