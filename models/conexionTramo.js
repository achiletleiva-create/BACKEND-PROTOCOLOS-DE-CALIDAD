const mongoose = require('mongoose');

const ConexionTramoSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true, unique: true },
  fecha: { type: Date, default: Date.now },
  pdf_url: { type: String, default: '' },

  datos_tramo: {
    calle_pasaje:   { type: String, required: true },
    bz_inicio:      String,
    bz_fin:         String,
    tipo_colector:  String,
    diametro_dn:    Number,
    longitud_tramo: Number
  },

  materiales: {
    elemento_union:   { type: String, enum: ['SI', 'NO'], default: 'SI' },
    tuberia_descarga: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    codos:            { type: String, enum: ['SI', 'NO'], default: 'SI' },
    caja_registro:    { type: String, enum: ['SI', 'NO'], default: 'SI' }
  },

  conexiones: [{
    item:              Number,
    mz_lote:           String,
    nro_casa:          String,
    prof_colector:     Number,
    prof_caja:         Number,
    pendiente:         Number,
    angulo_45:         { type: String, enum: ['SI', 'NO'], default: 'SI' },
    prueba_resultado:  { type: String, enum: ['Flujo Inmediato', 'Flujo Lento', 'Obstruido'], default: 'Flujo Inmediato' },
    estado_cachimba:   { type: String, enum: ['Sin Filtraciones', 'Con Filtración'], default: 'Sin Filtraciones' },
    resultado:         { type: String, enum: ['APROBADO', 'RECHAZADO'], default: 'APROBADO' }
  }],

  resultado_tramo: { type: String, enum: ['APROBADO', 'RECHAZADO'], default: 'APROBADO' },
  observaciones: String,

  fotos: {
    foto_materiales:  String,
    foto_instalacion: String,
    foto_prueba:      String
  }
}, { timestamps: true });

module.exports = mongoose.model('ConexionTramo', ConexionTramoSchema);
