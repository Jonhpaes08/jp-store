import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import path from "path";
  
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8888 } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const app = express();
  
// hospedar arquivos estáticos
app.use(express.static("client"));
  
// analisar parâmetros de postagem enviados no corpo em formato json
app.use(express.json());
  
/**
* Gere um token de acesso OAuth 2.0 para autenticação com APIs REST do PayPal.
* @see https://developer.paypal.com/api/rest/authentication/
*/
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Falha ao gerar token de acesso:", error);
  }
};
  
/**
* Crie um pedido para iniciar a transação.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
*/
const createOrder = async (cart) => {
  // use as informações do carrinho passadas pelo front-end para calcular os detalhes da unidade de compra
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    cart,
  );
  
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "R$",
          value: "100.00",
        },
      },
    ],
  };
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Remova o comentário de um deles para forçar um erro no teste negativo (somente no modo sandbox). Documentação:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  
  return handleResponse(response);
};
  
/**
* Capture o pagamento do pedido criado para concluir a transação.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
*/
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Remova o comentário de um deles para forçar um erro no teste negativo (somente no modo sandbox). Documentação:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });
  
  return handleResponse(response);
};
  
async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
  
app.post("/api/orders", async (req, res) => {
  try {
    // use as informações do carrinho passadas pelo front-end para calcular os detalhes do valor do pedido
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});
  
app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});
  
// serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./client/checkout.html"));
});
  
app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}/`);
});