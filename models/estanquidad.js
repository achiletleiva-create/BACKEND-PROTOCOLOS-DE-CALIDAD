const mongoose = require('mongoose');

const EstanquidadSchema = new mongoose.Schema({
  nro_protocolo: { type: String, required: true },
  proyecto: { type: String, default: "Mejoramiento Redes de Alcantarillado - Sector Liberación Social" },
  fecha: { type: Date, default: Date.now },
  
  // Datos específicos del PDF de Estanquidad
  datos_elemento: {
    id_buzon: { type: String, required: true },
    tipo_buzon: String,
    diametro_d: { type: Number, help: "Diámetro interno en metros" },
    altura_h: { type: Number, help: "Altura de agua de prueba en metros" },
    material_tuberia: { type: String, enum: ['PVC TDP Eurotubo', 'HDPE', 'Otro'] },
    presion_p: { type: Number, default: 1 }
  },

  // Resultados de la prueba (Cálculos)
  resultados: {
    perdida_max_permitida_vp: Number, // Calculado con la fórmula 0.001 * D * H * √P
    lectura_inicial: Number,
    lectura_final: Number,
    descenso_real: Number,
    resultado_final: { type: String, enum: ['APROBADO', 'RECHAZADO'] }
  },

  // Checklist de Inspección (Sección 3.0 del PDF)
  controles: {
    // 1.0 Preparación
    limpieza_interior: { estado: { type: String, default: "C" }, obs: String },
    sellado_tuberias: { estado: { type: String, default: "C" }, obs: String },
    conexion_sello_estanco: { estado: { type: String, default: "C" }, obs: String },
    
    // 2.0 Procedimiento
    periodo_saturacion: { estado: { type: String, default: "C" }, obs: String },
    marcado_nivel_inicial: { estado: { type: String, default: "C" }, obs: String },
    tiempo_prueba_minimo: { estado: { type: String, default: "C" }, obs: String },
    
    // 3.0 Estado Final
    ausencia_filtraciones: { estado: { type: String, default: "C" }, obs: String },
    descenso_tolerancia: { estado: { type: String, default: "C" }, obs: String }
  },

  // Registro fotográfico específico para estanquidad
  fotos: {
    foto_general_buzon: String,
    foto_nivel_inicial: String,
    foto_nivel_final: String,
    foto_juntas_selladas: String
  },

  responsables: {
    calidad: String,
    residente: String,
    supervision: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Estanquidad', EstanquidadSchema);
