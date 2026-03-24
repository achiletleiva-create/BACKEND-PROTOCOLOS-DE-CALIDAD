const mongoose = require('mongoose');
const ProtocoloSchema = new mongoose.Schema({
  nro_protocolo: { type: String, default: "CONC-001-2024" },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  datos_tecnicos: {
    elemento: String,
    resistencia_fc: String,
    ubicacion: { type: String, default: "Víctor Larco Herrera" }
  },
  controles: {
    // 1.0 Controles Previos
    limpieza_niveles: { type: String, default: "C" },
    obs_limpieza: String,
    estanqueidad_encofrado: { type: String, default: "C" },
    obs_estanqueidad: String,
    aplicacion_desmoldante: { type: String, default: "C" },
    obs_desmoldante: String,
    agregados_limpios: { type: String, default: "C" },
    obs_agregados: String,
    cemento_vigente: { type: String, default: "C" },
    obs_cemento: String,
    
    // 2.0 Mezclado
    dosificacion_mezcla: { type: String, default: "C" },
    obs_dosificacion: String,
    tiempo_mezclado: { type: String, default: "C" },
    obs_tiempo_mezcla: String,
    relacion_agua_cemento: { type: String, default: "C" },
    obs_agua_cemento: String,
    
    // 3.0 Ensayos
    ensayo_slump: { type: String, default: "C" },
    obs_slump: String,
    temperatura_concreto: { type: String, default: "C" },
    obs_temperatura: String,
    toma_testigos: { type: String, default: "C" },
    obs_testigos: String,
    probetas_cantidad: { type: Number, default: 2 },
    
    // 4.0 Colocación
    altura_caida: { type: String, default: "C" },
    obs_caida: String,
    compactacion_vibrado: { type: String, default: "C" },
    obs_vibrado: String,
    acabado_superficial: { type: String, default: "C" },
    obs_acabado: String,
    
    // 5.0 Curado
    inicio_curado: { type: String, default: "C" },
    obs_inicio_curado: String,
    metodo_curado: { type: String, default: "C" },
    obs_metodo_curado: String
  },
  fotos: {
    foto_slump: String,
    foto_mezclado: String,
    foto_encofrado: String,
    foto_probetas: String,
    foto_vibrado: String,
    foto_curado: String
  },
  // ✅ NUEVO: URL del PDF generado y subido a Cloudinary
  pdf_url: { type: String, default: "" },
  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
}, { timestamps: true });
module.exports = mongoose.model('Protocolo', ProtocoloSchema);
