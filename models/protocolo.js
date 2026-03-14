const mongoose = require('mongoose');

const ProtocoloSchema = new mongoose.Schema({
  nro_protocolo: { type: String, default: "CONC-001-2024" }, // 
  proyecto: String, // 
  fecha: { type: Date, default: Date.now }, // [cite: 4]
  datos_tecnicos: {
    elemento: String, // [cite: 3]
    resistencia_fc: String, // [cite: 5, 6]
    ubicacion: String // 
  },
  // Sección 1.0 y 2.0 del PDF 
  controles: {
    limpieza_niveles: String, 
    estanqueidad_encofrado: String,
    dosificacion_mezcla: String,
    relacion_agua_cemento: String
  },
  // Sección 3.0: Ensayos en concreto fresco 
  ensayos: {
    slump_pulgadas: Number, // Máximo 4" 
    temperatura_c: Number, // 10°C a 32°C 
    probetas_cantidad: { type: Number, default: 2 } // 
  },
  // URLs de las 6 fotos obligatorias [cite: 14]
  fotos: {
    foto_slump: String,
    foto_mezclado: String,
    foto_encofrado: String,
    foto_probetas: String,
    foto_vibrado: String,
    foto_curado: String
  },
  responsables: {
    calidad: String, // [cite: 9]
    residente: String, // [cite: 10]
    supervision: String // [cite: 11]
  }
});

module.exports = mongoose.model('Protocolo', ProtocoloSchema);
