const express = require("express");
const { Client, LocalAuth, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
const PORT = 3001;

// Inicializar cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// Mostrar QR en consola
client.on("qr", (qr) => {
  console.log("📱 Escanea este QR con tu WhatsApp App:");
  qrcode.generate(qr, { small: true });
});

// Cliente listo
client.on("ready", () => {
  console.log("✅ WhatsApp Web conectado y listo!");
});

// Guardar estado por usuario
const userStates = {};

// Función para iniciar la encuesta
async function startSurvey(userId, nombre) {
  userStates[userId] = { step: 1, data: {}, finished: false };
  await client.sendMessage(
    userId,
    `Hola, ${nombre}… soy Julieta tu asistente virtual en Cajacopi EPS.\n` +
      `Ten presente que este chat no acepta ni notas de voz, ni videos.\n` +
      `A continuación, te realizaremos una breve encuesta que nos permitirá conocer tu estado actual en salud sexual y reproductiva.`
  );
  await client.sendMessage(
    userId,
    "¿Estás de acuerdo con la aplicación de la encuesta?\n1. SI\n2. NO"
  );
}

// Listener de mensajes
client.on("message", async (message) => {
  const userId = message.from;
  const nombre =
    message._data?.notifyName || message._data?.pushname || "María";
  const text = message.body.trim();

  // Inicializar estado si es nuevo usuario o si ya terminó la encuesta
  if (!userStates[userId] || userStates[userId].finished) {
    await startSurvey(userId, nombre);
    return;
  }

  const userState = userStates[userId];

  // --- Lógica para relanzar la encuesta solo con comando "ENCUESTA" ---
  if (
    !userStates[userId] ||
    (userStates[userId].finished && text.toUpperCase() === "ENCUESTA")
  ) {
    await startSurvey(userId, nombre);
    return;
  }

  // Si la encuesta ya terminó y no escribió "ENCUESTA"
  if (userState.finished) {
    await client.sendMessage(
      userId,
      `Hola ${nombre}, ya terminaste la encuesta. Si deseas realizarla otra vez, escribe: ENCUESTA`
    );
    return;
  }

  // --- Paso 1: Acuerdo SI/NO ---
  if (userState.step === 1) {
    if (text === "1") {
      // SI
      userState.step = 2;
      await client.sendMessage(
        userId,
        "1️⃣ Has tenido relaciones sexuales?\n1. SI\n2. NO"
      );
    } else if (text === "2") {
      // NO
      userState.step = 99;
      userState.finished = true;
      await client.sendMessage(
        userId,
        "A continuación, te indico algunas posibles razones por las cuales no deseas contestar esta encuesta, por favor elige la que consideres:\n" +
          "1. Tengo método de planificación familiar definitivo\n" +
          "2. No tengo relaciones sexuales actualmente\n" +
          "3. No tengo tiempo\n" +
          "4. No me interesa\n" +
          "5. No puedo tener bebés\n\n" +
          `María, en el momento que consideres necesario puedes acercarte a tu IPS o comunicarte al número 3004568909 y solicitar una cita de planificación familiar completamente gratuita. Recuerda que estamos para acompañarte en todo momento.`
      );
    } else {
      await client.sendMessage(
        userId,
        "Por favor selecciona 1 para SI o 2 para NO."
      );
    }
    return;
  }

  // --- Paso 2: Relación sexual SI/NO ---
  if (userState.step === 2) {
    if (text === "1") {
      // SI
      userState.step = 3;
      await client.sendMessage(
        userId,
        "2️⃣ Actualmente utilizas algún método para prevenir un embarazo?\n1. SI\n2. NO"
      );
    } else if (text === "2") {
      // NO
      userState.step = 100;
      userState.finished = true;
      await client.sendMessage(
        userId,
        `María, en el momento que consideres necesario puedes acercarte a tu IPS o comunicarte al número 3004568909 y solicitar una cita de planificación familiar completamente gratuita, recuerda que estamos para acompañarte en todo momento.`
      );
    } else {
      await client.sendMessage(
        userId,
        "Por favor selecciona 1 para SI o 2 para NO."
      );
    }
    return;
  }

  // --- Paso 3: Método anticonceptivo SI/NO ---
  if (userState.step === 3) {
    if (text === "1") {
      // SI
      userState.step = 4;
      await client.sendMessage(
        userId,
        "A continuación, indícame cuál de estos métodos estás usando actualmente:\n" +
          "1. Pastillas\n" +
          "2. Inyección mensual\n" +
          "3. Inyección trimestral\n" +
          "4. Implante subdérmico\n" +
          "5. T de cobre\n" +
          "6. Otro"
      );
    } else if (text === "2") {
      // NO
      userState.step = 5;
      await client.sendMessage(
        userId,
        "3️⃣ ¿Planeas quedar embarazada en los próximos 12 meses?\n1. SI\n2. NO"
      );
    } else {
      await client.sendMessage(
        userId,
        "Por favor selecciona 1 para SI o 2 para NO."
      );
    }
    return;
  }

  // --- Paso 4: Elegir método anticonceptivo ---
  if (userState.step === 4) {
    if (["1", "2", "3", "4", "5"].includes(text)) {
      userState.step = 5;
      await client.sendMessage(
        userId,
        "3️⃣ ¿Planeas quedar embarazada en los próximos 12 meses?\n1. SI\n2. NO"
      );
    } else if (text === "6") {
      userState.step = 41;
      await client.sendMessage(
        userId,
        "Por favor escribe cuál método estás utilizando:"
      );
    } else {
      await client.sendMessage(
        userId,
        "Selecciona un número válido entre 1 y 6."
      );
    }
    return;
  }

  // --- Paso 4.1: Escribir método "Otro" ---
  if (userState.step === 41) {
    userState.data.metodoOtro = text;
    userState.step = 5;
    await client.sendMessage(
      userId,
      "3️⃣ ¿Planeas quedar embarazada en los próximos 12 meses?\n1. SI\n2. NO"
    );
    return;
  }

  // --- Paso 5: Planificación de embarazo SI/NO ---
  if (userState.step === 5) {
    if (text === "1") {
      // SI
      userState.step = 6;
      await client.sendMessage(
        userId,
        "4️⃣ ¿Ha recibido una consulta por médico en donde hayas manifestado tu deseo de quedar embarazada?\n1. SI\n2. NO"
      );
    } else if (text === "2") {
      // NO
      userState.step = 101;
      userState.finished = true;
      await client.sendMessage(
        userId,
        `María, en los próximos 5 días tu IPS te contactará para asignarte una cita de planificación familiar en el que podrás elegir un método anticonceptivo para evitar embarazos no planeados.`
      );
    } else {
      await client.sendMessage(
        userId,
        "Por favor selecciona 1 para SI o 2 para NO."
      );
    }
    return;
  }

  // --- Paso 6: Consulta médica previa SI/NO ---
  if (userState.step === 6) {
    if (text === "1") {
      // SI
      userState.step = 102;
      userState.finished = true;
      await client.sendMessage(
        userId,
        `María, recuerda que debes cumplir con todos los controles y recomendaciones que tu médico te entregó. Si requieres continuar con tu proceso de atención, puedes comunicarte al 3004568909 y solicitar una cita completamente gratuita en tu IPS de atención.\n` +
          `En caso de que no hayas cumplido con todas las citas asignadas, tu IPS de atención te contactará en los próximos 5 días para asignarte las citas que sean pertinentes.`
      );
    } else if (text === "2") {
      // NO
      userState.step = 103;
      userState.finished = true;
      await client.sendMessage(
        userId,
        `María, en los próximos 5 días tu IPS te contactará para asignarte una cita de atención preconcepcional que nos permitirá evaluar tu estado de salud y prepararte para un embarazo saludable.\n` +
          `Recuerda que en cualquier momento que lo desees puedes acercarte a tu IPS o comunicarte al número 3004568909 y solicitar una cita completamente gratuita en tu IPS de atención.`
      );
    } else {
      await client.sendMessage(
        userId,
        "Por favor selecciona 1 para SI o 2 para NO."
      );
    }
    return;
  }
});

// Inicializar cliente
client.initialize();

// Servidor Express
app.get("/", (req, res) => {
  res.send("✅ Bot corriendo y listo para responder mensajes.");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
