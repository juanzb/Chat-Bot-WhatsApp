const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;
const respuestas = require("./constants response");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("¡Hola! Este es un bot de prueba usando Twilio.");
  console.log("¡Hola! Este es un bot de prueba usando Twilio.");
});

// Endpoint para recibir mensajes de WhatsApp
app.post("/whatsapp", (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase().trim();
  console.log(`Mensaje recibido: ${incomingMsg} de ${req.body.From}`);

  const twiml = new MessagingResponse();
  const respuesta =
    respuestas[incomingMsg] || "Lo siento, no entiendo tu mensaje.";
  twiml.message(respuesta);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
