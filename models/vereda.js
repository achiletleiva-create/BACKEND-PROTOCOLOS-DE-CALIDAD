const mongoose = require('mongoose');

const VeredaSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  pdf_url: { type: String, default: "" },

  datos_campo: {
    frente_trabajo: { type: String, required: true },
    sector_pasaje: String,
    nro_informe_lab: String
  },

  cumplimiento_normativo: {
    preparacion_mezclado: { type: String, enum: ['C', 'NC'], default: 'C' },
    resistencia_compresion: { type: String, enum: ['C', 'NC'], default: 'C' },
    espesor_vereda: { type: String, enum: ['C', 'NC'], default: 'C' },
    pendiente_transversal: { type: String, enum: ['C', 'NC'], default: 'C' },
    cemento_sulfatos: { type: String, enum: ['C', 'NC'], default: 'C' }
  },

  resanes: [
    {
      item: Number,
      pasaje_calle: String,
      mz_lote: String,
      largo: Number,
      ancho: Number,
      area: Number
    }
  ],

  area_total: Number,
  observaciones: String,

  fotos: {
    foto_antes: String,
    foto_vaciado: String,
    foto_acabado: String
  },

  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Vereda', VeredaSchema);
