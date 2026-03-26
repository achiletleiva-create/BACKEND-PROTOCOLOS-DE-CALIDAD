const mongoose = require('mongoose');

const ConexionSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true, unique: true },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  pdf_url: { type: String, default: "" },

  datos_ubicacion: {
    calle_pasaje: { type: String, required: true },
    manzana_lote: String,
    nro_casa: String,
    tramo_bz_inicio: String,
    tramo_bz_fin: String,
    tipo_colector: String,
    diametro_dn: Number
  },

  materiales: {
    elemento_union: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    tuberia_descarga: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    codos: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    caja_registro: { type: String, enum: ['SI', 'NO'], default: 'SI' }
  },

  control_instalacion: {
    profundidad_colector_proyecto: Number,
    profundidad_colector_ejecutado: Number,
    profundidad_caja_registro_proyecto: { type: Number, default: 0.60 },
    profundidad_caja_registro_ejecutado: Number,
    pendiente_proyecto: { type: Number, default: 1.5 },
    pendiente_ejecutado: Number,
    angulo_empalme_45: { type: String, enum: ['SI', 'NO'], default: 'SI' }
  },

  prueba_operatividad: {
    volumen_agua: Number,
    resultado_red_matriz: { type: String, enum: ['Flujo Inmediato', 'Flujo Lento', 'Obstruido'], default: 'Flujo Inmediato' },
    estado_cachimba: { type: String, enum: ['Sin Filtraciones', 'Con Filtración'], default: 'Sin Filtraciones' }
  },

  resultado_final: { type: String, enum: ['APROBADO', 'RECHAZADO'], default: 'APROBADO' },
  observaciones: String,

  fotos: {
    foto_material: String,
    foto_instalacion: String,
    foto_prueba: String
  },

  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Conexion', ConexionSchema);
