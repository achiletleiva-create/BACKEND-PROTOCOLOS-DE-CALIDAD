const mongoose = require('mongoose');

const EstanquidadSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  
  pdf_url: { type: String, default: "" },  // ✅ para guardar el enlace del PDF

  datos_elemento: {
    id_buzon: { type: String, required: true },
    diametro_d: { type: Number, help: "Diámetro interno en metros" },
    altura_h: { type: Number, help: "Altura de agua de prueba en metros" },
    material_tuberia: { type: String, enum: ['PVC TDP Eurotubo', 'HDPE', 'Otro'] },
    presion_p: { type: Number, default: 1 }
  },

  resultados: {
    perdida_max_permitida_vp: Number,
    lectura_inicial: Number,
    lectura_final: Number,
    descenso_real: Number,
    resultado_final: { type: String, enum: ['APROBADO', 'RECHAZADO'] }
  },

  controles: {
    limpieza_interior: { estado: { type: String, default: "C" }, obs: String },
    sellado_tuberias: { estado: { type: String, default: "C" }, obs: String },
    conexion_sello_estanco: { estado: { type: String, default: "C" }, obs: String },
    periodo_saturacion: { estado: { type: String, default: "C" }, obs: String },
    marcado_nivel_inicial: { estado: { type: String, default: "C" }, obs: String },
    tiempo_prueba_minimo: { estado: { type: String, default: "C" }, obs: String },
    ausencia_filtraciones: { estado: { type: String, default: "C" }, obs: String },
    descenso_tolerancia: { estado: { type: String, default: "C" }, obs: String }
  },

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

module.exports = mongoose.model('Estanquidad', EstanquidadSchema);
