const mongoose = require('mongoose');

const TuberiaSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true, unique: true },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  pdf_url: { type: String, default: "" },

  datos_ubicacion: {
    tramo_bz_inicio: { type: String, required: true },
    tramo_bz_fin: { type: String, required: true },
    calle_pasaje: String,
    tipo_tuberia: String,
    diametro_dn: Number,
    sdr_serie: String,
    longitud_tramo: Number
  },

  inspeccion_previa: {
    certificado_calidad: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' },
    integridad_fisica: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' },
    limpieza_espiga_campana: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' },
    lubricante_fabricante: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' },
    anillo_elastomerico: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' }
  },

  control_topografico: {
    cota_tapa_bz_llegada: Number,
    cota_invertida_salida: Number,
    pendiente: Number,
    cama_apoyo_espesor: { type: Number, default: 0.10 }
  },

  verificacion_instalacion: {
    tuberia_sobre_cama: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    campana_contra_flujo: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    alineamiento_horizontal: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    prueba_espejo: { type: String, enum: ['SI', 'NO'], default: 'SI' }
  },

  observaciones: String,

  fotos: {
    foto_material: String,
    foto_instalacion: String,
    foto_alineamiento: String
  },

  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Tuberia', TuberiaSchema);
