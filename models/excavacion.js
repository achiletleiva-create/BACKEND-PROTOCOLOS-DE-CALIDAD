const mongoose = require('mongoose');

const ExcavacionSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  pdf_url: { type: String, default: "" },

  datos_identificacion: {
    tramo_bz_inicio: { type: String, required: true },
    tramo_bz_fin: { type: String, required: true },
    calle_pasaje: String,
    metodo_excavacion: { type: String, enum: ['Manual', 'Mecánica (Retroexcavadora)'] },
    tipo_terreno: { type: String, enum: ['Terreno Normal', 'Terreno Semirocoso', 'Terreno Rocoso'] }
  },

  control_topografico: {
    ancho_zanja_proyecto: Number,
    ancho_zanja_realizado: Number,
    profundidad_inicio_proyecto: Number,
    profundidad_inicio_realizado: Number,
    profundidad_fin_proyecto: Number,
    profundidad_fin_realizado: Number,
    cota_fondo_proyecto: Number,
    cota_fondo_realizado: Number
  },

  condiciones_seguridad: {
    senalizacion_cerco: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    fondo_nivelado: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    entibado: { type: String, enum: ['SI', 'NO', 'N/A'], default: 'N/A' },
    zanja_seca: { type: String, enum: ['SI', 'NO', 'N/A'], default: 'SI' },
    material_excedente: { type: String, enum: ['SI', 'NO'], default: 'SI' }
  },

  observaciones: String,

  fotos: {
    foto_inicio: String,
    foto_fondo: String,
    foto_seguridad: String
  },

  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Excavacion', ExcavacionSchema);
