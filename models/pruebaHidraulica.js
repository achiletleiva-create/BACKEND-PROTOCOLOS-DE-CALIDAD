const mongoose = require('mongoose');

const PruebaHidraulicaSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  pdf_url: { type: String, default: "" },

  datos_tramo: {
    bz_inicio: { type: String, required: true },
    bz_fin: { type: String, required: true },
    material_diametro: String,
    longitud_tramo: Number,
    hora_puesta_servicio: String
  },

  control_alineamiento: {
    cota_invertida_salida: Number,
    cota_invertida_llegada: Number,
    pendiente_calculada: Number,
    prueba_espejo: { type: String, enum: ['Completa', 'Parcial'], default: 'Completa' },
    estado_alineamiento: { type: String, enum: ['C', 'NC'], default: 'C' }
  },

  verificacion_operatividad: {
    flujo_libre_aguas_residuales: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    uniones_empalmes_estancos: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    limpieza_ducto: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    recubrimiento_minimo: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    tramo_sin_represamiento: { type: String, enum: ['SI', 'NO'], default: 'SI' }
  },

  resultado_final: { type: String, enum: ['APROBADO', 'RECHAZADO'], default: 'APROBADO' },
  observaciones: String,

  fotos: {
    foto_antes: String,
    foto_durante: String,
    foto_despues: String
  },

  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
}, { timestamps: true });

module.exports = mongoose.model('PruebaHidraulica', PruebaHidraulicaSchema);
