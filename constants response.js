// Respuestas predeterminadas
const respuestas = {
  // Saludos
  hola: "¡Hola! Bienvenido a tu EPS. ¿En qué podemos ayudarte hoy?",
  "buenos días": "¡Buenos días! ¿Cómo podemos asistirte hoy?",
  "buenas tardes": "¡Buenas tardes! ¿En qué podemos ayudarte?",
  "buenas noches": "¡Buenas noches! Estamos aquí para atenderte.",

  // Información general
  info: "Somos tu EPS de confianza. Puedes consultar citas médicas, servicios disponibles y realizar trámites desde este chat.",
  servicios:
    "Ofrecemos atención médica general, especialidades, urgencias, vacunación, programas de prevención y más.",
  cobertura:
    "Nuestra cobertura incluye consultas médicas, hospitalización, medicamentos y exámenes de laboratorio.",
  afiliación:
    "Puedes consultar tu estado de afiliación enviando 'estado afiliación' o realizar trámites de afiliación enviando 'trámites'.",

  // Citas médicas
  cita: "Para agendar una cita, por favor indica tu especialidad o escribe 'agendar cita'.",
  "agendar cita":
    "Puedes agendar tu cita llamando a nuestra línea 123-456-789 o a través de nuestra web: www.eps-ejemplo.com/citas",
  "cancelar cita":
    "Para cancelar una cita, necesitamos tu número de documento y la fecha de la cita.",
  "consultar cita":
    "Para consultar tus citas activas, envíanos tu número de documento y fecha de nacimiento.",

  // Estado de afiliación y trámites
  "estado afiliación":
    "Por favor envíanos tu número de documento para verificar tu estado de afiliación.",
  trámites:
    "Puedes realizar trámites de afiliación, actualización de datos, traslados y certificados desde nuestro portal: www.eps-ejemplo.com/tramites",
  certificado:
    "Para obtener tu certificado de afiliación, envíanos tu número de documento completo.",

  // Urgencias y contacto
  urgencias:
    "Si es una urgencia, dirígete al centro de salud más cercano o llama a la línea de urgencias 911.",
  contacto:
    "Puedes contactarnos al teléfono 123-456-789, correo info@eps-ejemplo.com o visitar nuestra web www.eps-ejemplo.com",

  // Preguntas frecuentes
  medicamentos:
    "Puedes consultar tu cobertura de medicamentos con tu número de afiliación en nuestra web o llamando a nuestra línea de atención.",
  laboratorio:
    "Para agendar exámenes de laboratorio, envía 'agendar laboratorio' con tu especialidad.",
  vacunación:
    "Consulta nuestro calendario de vacunación en www.eps-ejemplo.com/vacunacion",

  // Despedidas
  adiós: "¡Hasta luego! Que tengas un buen día y cuídate.",
  gracias: "¡Con gusto! Estamos para servirte.",
  ok: "Perfecto, ¿deseas algo más?",

  // Respuesta por defecto
  default:
    "Lo siento, no entendí tu mensaje. Por favor escribe palabras como 'cita', 'afiliación', 'servicios' o 'contacto'.",
};

module.exports = respuestas;
