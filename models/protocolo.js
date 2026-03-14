const mongoose = require('mongoose');

const ProtocoloSchema = new mongoose.Schema({
  nro_protocolo: { type: String, default: "CONC-001-2024" },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  datos_tecnicos: {
    elemento: String,
    resistencia_fc: String,
    ubicacion: String
  },
  controles: {
    limpieza_niveles: { type: String, default: "C" }, // C = Cumple
    estanqueidad_encofrado: { type: String, default: "C" },
    dosificacion_mezcla: { type: String, default: "C" },
    relacion_agua_cemento: { type: String, default: "C" }
  },
  ensayos: {
    slump_pulgadas: Number, // Validar en el front que sea <= 4"
    temperatura_c: Number, // Validar entre 10°C y 32°C
    probetas_cantidad: { type: Number, default: 2 }
  },
  fotos: {
    foto_slump: String,
    foto_mezclado: String,
    foto_encofrado: String,
    foto_probetas: String,
    foto_vibrado: String,
    foto_curado: String
  },
  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
});

module.exports = mongoose.model('Protocolo', ProtocoloSchema);
