const mongoose = require('mongoose');

const BuzonSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  pdf_url: { type: String, default: "" },

  datos_identificacion: {
    codigo_buzon: { type: String, required: true },
    calle_pasaje: String,
    tipo_buzon: { type: String, enum: ['Tipo I (h < 3.00m)', 'Tipo II (3.00m < h < 5.00m)'] },
    fecha_vaciado: Date
  },

  control_excavacion: {
    fondo_nivelado_compactado: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    solado_limpieza: { type: String, enum: ['SI', 'NO'], default: 'SI' },
    cotas_invertidas: { type: String, enum: ['SI', 'NO'], default: 'SI' }
  },

  control_concreto: {
    resistencia_fc_esp: { type: String, default: '175 kg/cm²' },
    resistencia_fc_real: String,
    resistencia_estado: { type: String, enum: ['C', 'NC'], default: 'C' },
    diametro_interior_esp: { type: String, default: '1.20 m' },
    diametro_interior_real: String,
    diametro_estado: { type: String, enum: ['C', 'NC'], default: 'C' },
    espesor_muro_esp: { type: String, default: '0.15 m / 0.20 m' },
    espesor_muro_real: String,
    espesor_estado: { type: String, enum: ['C', 'NC'], default: 'C' },
    tipo_cemento_esp: { type: String, default: 'MS / V' },
    tipo_cemento_real: String,
    cemento_estado: { type: String, enum: ['C', 'NC'], default: 'C' },
    slump_esp: { type: String, default: '3" a 4"' },
    slump_real: String,
    slump_estado: { type: String, enum: ['C', 'NC'], default: 'C' }
  },

  acabados: {
    media_cana: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' },
    tarrajeo_interno: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' },
    escalines: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' },
    tapa_buzon: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' },
    cota_tapa: { type: String, enum: ['CUMPLE', 'NO CUMPLE'], default: 'CUMPLE' }
  },

  observaciones: String,

  fotos: {
    foto_excavacion: String,
    foto_estructura: String,
    foto_acabados: String
  },

  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Buzon', BuzonSchema);
