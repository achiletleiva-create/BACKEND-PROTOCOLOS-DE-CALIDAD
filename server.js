require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Protocolo = require('./models/protocolo');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuración de Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Protocolos_Victor_Larco',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  },
});

const upload = multer({ storage: storage });

// 3. Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a la BD de Ingeniería'))
  .catch(err => console.error('❌ Error de conexión:', err));

// ============================================================
// 4. RUTA POST ACTUALIZADA (CAMBIOS AQUÍ)
// ============================================================
app.post('/api/protocolos', upload.fields([
  { name: 'foto_slump', maxCount: 1 },
  { name: 'foto_mezclado', maxCount: 1 },
  { name: 'foto_encofrado', maxCount: 1 },
  { name: 'foto_probetas', maxCount: 1 },
  { name: 'foto_vibrado', maxCount: 1 },
  { name: 'foto_curado', maxCount: 1 }
]), async (req, res) => {
  try {
    const urlsFotos = {};
    
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        urlsFotos[key] = req.files[key][0].path;
      });
    }

    // Mapeo exacto de los campos que envía tu formulario HTML
    const nuevoProtocolo = new Protocolo({
      nro_protocolo: req.body.nro_protocolo, // Captura el correlativo
      fecha: req.body.fecha,
      datos_tecnicos: {
        elemento: req.body.elemento,
        resistencia_fc: req.body.resistencia_fc,
        ubicacion: "Víctor Larco Herrera" 
      },
      // Se expande para incluir los 16 puntos de control del formulario
      controles: {
        // 1.0 Controles Previos
        limpieza_niveles: req.body.limpieza_niveles,
        estanqueidad_encofrado: req.body.estanqueidad_encofrado,
        aplicacion_desmoldante: req.body.aplicacion_desmoldante,
        agregados_limpios: req.body.agregados_limpios,
        cemento_vigente: req.body.cemento_vigente,
        
        // 2.0 Mezclado
        dosificacion_mezcla: req.body.dosificacion_mezcla,
        tiempo_mezclado: req.body.tiempo_mezclado,
        relacion_agua_cemento: req.body.relacion_agua_cemento,
        
        // 3.0 Ensayos
        ensayo_slump: req.body.ensayo_slump,
        temperatura_concreto: req.body.temperatura_concreto,
        toma_testigos: req.body.toma_testigos,
        probetas_cantidad: req.body.probetas_cantidad,
        
        // 4.0 Colocación
        altura_caida: req.body.altura_caida,
        compactacion_vibrado: req.body.compactacion_vibrado,
        acabado_superficial: req.body.acabado_superficial,
        
        // 5.0 Curado
        inicio_curado: req.body.inicio_curado,
        metodo_curado: req.body.metodo_curado
      },
      fotos: urlsFotos 
    });

    await nuevoProtocolo.save();
    res.status(201).json({ mensaje: "✅ Protocolo y fotos guardados con éxito" });
  } catch (error) {
    console.error("❌ Error en guardado:", error);
    res.status(500).json({ error: "Error interno al registrar: " + error.message });
  }
});
// ============================================================

// 5. Ruta de consulta
app.get('/api/protocolos', async (req, res) => {
  try {
    const lista = await Protocolo.find().sort({ fecha: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener lista" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
