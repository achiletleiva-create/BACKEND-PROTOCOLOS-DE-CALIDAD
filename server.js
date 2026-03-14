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

// 1. Configuración de Cloudinary (Usa tus variables de Render)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuración de Almacenamiento para las 6 fotos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Protocolos_Victor_Larco',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optimiza tamaño
  },
});

const upload = multer({ storage: storage });

// 3. Conexión a MongoDB (La que ya tienes funcionando 🚀)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a la BD de Ingeniería'))
  .catch(err => console.error('❌ Error de conexión:', err));

// 4. RUTA POST: Recibe datos y hasta 6 fotos
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
    
    // Extraer URLs de las fotos subidas a Cloudinary
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        urlsFotos[key] = req.files[key][0].path;
      });
    }

    const nuevoProtocolo = new Protocolo({
      ...req.body, // Recibe elemento, slump, temperatura, etc.
      fotos: urlsFotos // Guarda los links de Cloudinary
    });

    await nuevoProtocolo.save();
    res.status(201).json({ mensaje: "✅ Protocolo y fotos guardados con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el protocolo" });
  }
});

// Ruta simple para verificar que el backend sigue "Live"
app.get('/', (req, res) => res.send('API de Protocolos Víctor Larco Herrera - Activa'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
