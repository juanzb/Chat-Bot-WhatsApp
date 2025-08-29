const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ⚙️ Configuración de WATI
const WATI_API_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNTMyYmM3My1iZTYyLTRlYWQtYmNhOS0xMTQ2NDE1OWI3MTMiLCJ1bmlxdWVfbmFtZSI6Imp1YW56YXJhY2hlMjAwMEBnbWFpbC5jb20iLCJuYW1laWQiOiJqdWFuemFyYWNoZTIwMDBAZ21haWwuY29tIiwiZW1haWwiOiJqdWFuemFyYWNoZTIwMDBAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMDgvMjkvMjAyNSAwNDowMjowOCIsInRlbmFudF9pZCI6IjEwMTQwNjkiLCJkYl9uYW1lIjoibXQtcHJvZC1UZW5hbnRzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQURNSU5JU1RSQVRPUiIsImV4cCI6MjUzNDAyMzAwODAwLCJpc3MiOiJDbGFyZV9BSSIsImF1ZCI6IkNsYXJlX0FJIn0.VpltZej-FOQnPytZ-cDjsUX6-WC_dqsHCylUKt1DE3Y"; // pega aquí tu token
const BASE_URL = "https://app.wati.io/api/v1";

// 🔧 Función para enviar mensajes
async function sendMessage(to, text) {
  try {
    const resp = await axios.post(
      `${BASE_URL}/sendSessionMessage`, // 👈 versión nueva, sin Instance ID
      { phone: to, message: text },
      {
        headers: {
          Authorization: WATI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Mensaje enviado:", resp.data);
  } catch (err) {
    console.error(
      "❌ Error enviando mensaje:",
      err.response?.data || err.message
    );
  }
}

// 📩 Webhook: recibe mensajes entrantes desde WATI
app.post("/wati/webhook", async (req, res) => {
  console.log("📥 Mensaje entrante:", JSON.stringify(req.body, null, 2));

  const waId = req.body.waId;
  const text = req.body?.text?.toLowerCase() || ""; // 👈 en WATI el campo es "text"

  if (text.includes("hola")) {
    await sendMessage(
      waId,
      "👋 ¡Hola! Soy tu bot conectado con WATI 🚀\nElige una opción:\n1️⃣ Ver productos\n2️⃣ Hablar con agente\n3️⃣ Ayuda"
    );
  } else if (text === "1") {
    await sendMessage(
      waId,
      "📦 Estos son nuestros productos: Producto A, Producto B, Producto C."
    );
  } else if (text === "2") {
    await sendMessage(waId, "👨‍💻 Te paso con un agente humano...");
  } else if (text === "3") {
    await sendMessage(
      waId,
      "ℹ️ Soy un bot, puedo ayudarte con tus dudas más comunes."
    );
  } else {
    await sendMessage(
      waId,
      "❓ No entendí tu mensaje.\nResponde con:\n1️⃣ Ver productos\n2️⃣ Hablar con agente\n3️⃣ Ayuda"
    );
  }

  res.sendStatus(200);
});

// 🚀 Arrancar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Bot escuchando en http://localhost:${PORT}`);
});
