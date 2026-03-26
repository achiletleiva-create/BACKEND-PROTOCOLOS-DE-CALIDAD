const mongoose = require('mongoose');

const RellenoSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  pdf_url: { type: String, default: "" },

  datos_identificacion: {
    sector_calle: { type: String, required: true },
    tramo_bz_inicio: String,
    tramo_bz_fin: String,
    tipo_via: { type: String, enum: ['Pasaje / Calle Interna', 'Avenida Principal'] }
  },

  especificaciones: {
    cama_apoyo: { type: String, enum: ['C', 'NC'], default: 'C' },
    relleno_proteccion: { type: String, enum: ['C', 'NC'], default: 'C' },
    espesor_capas: { type: String, enum: ['C', 'NC'], default: 'C' },
    nivel_cierre: { type: String, enum: ['C', 'NC'], default: 'C' },
    compactacion_porcentaje: { type: String, enum: ['C', 'NC'], default: 'C' }
  },

  ensayos_compactacion: [
    {
      punto: Number,
      progresiva_ubicacion: String,
      tramo: String,
      profundidad: String,
      porcentaje_compactacion: Number,
      resultado: { type: String, enum: ['Cumple', 'No Cumple'], default: 'Cumple' }
    }
  ],

  laboratorio: {
    mds_proctor: Number,
    optimo_contenido_humedad: Number
  },

  equipos: {
    plancha_compactadora: { type: Boolean, default: false },
    vibroapisonador: { type: Boolean, default: false },
    motobomba: { type: Boolean, default: false },
    otros: String
  },

  observaciones: String,

  fotos: {
    foto_relleno: String,
    foto_compactacion: String,
    foto_ensayo: String
  },

  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Relleno', RellenoSchema);
