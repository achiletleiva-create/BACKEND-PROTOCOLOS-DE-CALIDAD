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
  // SECCIÓN ACTUALIZADA: Ahora incluye los 16 puntos de control del PDF
  controles: {
    // 1.0 Controles Previos
    limpieza_niveles: { type: String, default: "C" },
    estanqueidad_encofrado: { type: String, default: "C" },
    aplicacion_desmoldante: { type: String, default: "C" },
    agregados_limpios: { type: String, default: "C" },
    cemento_vigente: { type: String, default: "C" },
    
    // 2.0 Mezclado
    dosificacion_mezcla: { type: String, default: "C" },
    tiempo_mezclado: { type: String, default: "C" },
    relacion_agua_cemento: { type: String, default: "C" },
    
    // 3.0 Ensayos
    ensayo_slump: { type: String, default: "C" },
    temperatura_concreto: { type: String, default: "C" },
    toma_testigos: { type: String, default: "C" },
    probetas_cantidad: { type: Number, default: 2 },
    
    // 4.0 Colocación
    altura_caida: { type: String, default: "C" },
    compactacion_vibrado: { type: String, default: "C" },
    acabado_superficial: { type: String, default: "C" },
    
    // 5.0 Curado
    inicio_curado: { type: String, default: "C" },
    metodo_curado: { type: String, default: "C" }
  },
  // Mantenemos la estructura de ensayos por si envías valores numéricos específicos
  ensayos: {
    slump_pulgadas: String, 
    temperatura_c: String,
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
}, { timestamps: true }); // Añade fecha de creación y actualización automática

module.exports = mongoose.model('Protocolo', ProtocoloSchema);
