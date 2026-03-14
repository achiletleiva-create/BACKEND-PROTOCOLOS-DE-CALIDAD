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

// 1. Configuración de Cloudinary usando tus credenciales de Render
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuración de Multer para las 6 fotos obligatorias
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Protocolos_Victor_Larco',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  },
});

const upload = multer({ storage: storage });

// 3. Conexión a MongoDB (Confirmada en tus logs anteriores)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a la BD de Ingeniería'))
  .catch(err => console.error('❌ Error de conexión:', err));

// 4. RUTA PRINCIPAL: Recibir datos y las 6 imágenes
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
    
    // Si hay archivos, mapeamos sus rutas de Cloudinary al objeto fotos
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        urlsFotos[key] = req.files[key][0].path;
      });
    }

    // Mapear req.body (que viene plano del form) a la estructura anidada del modelo
    const nuevoProtocolo = new Protocolo({
      datos_tecnicos: {
        elemento: req.body.elemento,
        resistencia_fc: req.body.resistencia_fc,
        ubicacion: req.body.ubicacion
      },
      ensayos: {
        slump_pulgadas: req.body.slump_pulgadas,
        temperatura_c: req.body.temperatura_c,
        probetas_cantidad: req.body.probetas_cantidad
      },
      controles: {
        limpieza_niveles: req.body.limpieza_niveles,
        estanqueidad_encofrado: req.body.estanqueidad_encofrado,
        dosificacion_mezcla: req.body.dosificacion_mezcla,
        relacion_agua_cemento: req.body.relacion_agua_cemento
      },
      responsables: {
        calidad: req.body.calidad,
        residente: req.body.residente,
        supervision: req.body.supervision
      },
      fotos: urlsFotos // Links generados en Cloudinary
    });

    await nuevoProtocolo.save();
    res.status(201).json({ mensaje: "✅ Protocolo y fotos guardados con éxito" });
  } catch (error) {
    console.error("❌ Error en guardado:", error);
    res.status(500).json({ error: "No se pudo registrar el protocolo" });
  }
});

// Ruta de consulta para ver todos los protocolos registrados
app.get('/api/protocolos', async (req, res) => {
  const lista = await Protocolo.find().sort({ fecha: -1 });
  res.json(lista);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
