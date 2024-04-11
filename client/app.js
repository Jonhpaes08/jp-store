window.paypal
  .Buttons({
    async createOrder() {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
            // use o parâmetro "body" para passar opcionalmente informações adicionais do pedido
            // gosta de ids e quantidades de produtos
          body: JSON.stringify({
            cart: [
              {
                id: "YOUR_PRODUCT_ID",
                quantity: "YOUR_PRODUCT_QUANTITY",
              },
            ],
          }),
        });
        
        const orderData = await response.json();
        
        if (orderData.id) {
          return orderData.id;
        } else {
          const errorDetail = orderData?.details?.[0];
          const errorMessage = errorDetail
            ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
            : JSON.stringify(orderData);
          
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error(error);
        resultMessage(`Não foi possível iniciar o check-out do PayPal...<br><br>${error}`);
      }
    },
    async onApprove(data, actions) {
      try {
        const response = await fetch(`/api/orders/${data.orderID}/capture`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const orderData = await response.json();
        // Três casos para tratar:
         // (1) INSTRUMENT_DECLINED recuperável -> chamar actions.restart()
         // (2) Outros erros não recuperáveis -> Mostrar uma mensagem de falha
         // (3) Transação bem-sucedida -> Mostrar confirmação ou mensagem de agradecimento
        
        const errorDetail = orderData?.details?.[0];
        
        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          // (1) INSTRUMENT_DECLINED recuperável -> chame actions.restart()
          // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
          return actions.restart();
        } else if (errorDetail) {
          // (2) Other non-recoverable errors -> Show a failure message
          throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
        } else if (!orderData.purchase_units) {
          throw new Error(JSON.stringify(orderData));
        } else {
          // (3) Transação bem-sucedida -> Mostrar confirmação ou mensagem de agradecimento
          // Ou vá para outro URL: actions.redirect('thank_you.html');
          const transaction =
            orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
            orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
          resultMessage(
            `Transaction ${transaction.status}: ${transaction.id}<br><br>Consulte o console para todos os detalhes disponíveis`,
          );
          console.log(
            "Capture result",
            orderData,
            JSON.stringify(orderData, null, 2),
          );
        }
      } catch (error) {
        console.error(error);
        resultMessage(
          `Desculpe, sua transação não pôde ser processada...<br><br>${error}`,
        );
      }
    },
  })
  .render("#paypal-button-container");
  // Example function to show a result to the user. Your site's UI library can be used instead.function resultMessage(message) {const container = document.querySelector("#result-message");container.innerHTML = message;
// Função de exemplo para mostrar um resultado ao usuário. A biblioteca de UI do seu site pode ser usada.
function resultMessage(message) {
  const container = document.querySelector("#result-message");
  container.innerHTML = message;
}