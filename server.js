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

// 4. RUTA POST - REGISTRO DE PROTOCOLO (CONCRETO) - NO MODIFICADO
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

    const nuevoProtocolo = new Protocolo({
      nro_protocolo: req.body.nro_protocolo,
      fecha: req.body.fecha,
      datos_tecnicos: {
        elemento: req.body.elemento,
        resistencia_fc: req.body.resistencia_fc,
        ubicacion: "Víctor Larco Herrera"
      },
      controles: {
        limpieza_niveles: req.body.limpieza_niveles,
        obs_limpieza: req.body.obs_limpieza,
        estanqueidad_encofrado: req.body.estanqueidad_encofrado,
        obs_estanqueidad: req.body.obs_estanqueidad,
        aplicacion_desmoldante: req.body.aplicacion_desmoldante,
        obs_desmoldante: req.body.obs_desmoldante,
        agregados_limpios: req.body.agregados_limpios,
        obs_agregados: req.body.obs_agregados,
        cemento_vigente: req.body.cemento_vigente,
        obs_cemento: req.body.obs_cemento,
        
        dosificacion_mezcla: req.body.dosificacion_mezcla,
        obs_dosificacion: req.body.obs_dosificacion,
        tiempo_mezclado: req.body.tiempo_mezclado,
        obs_tiempo_mezcla: req.body.obs_tiempo_mezcla,
        relacion_agua_cemento: req.body.relacion_agua_cemento,
        obs_agua_cemento: req.body.obs_agua_cemento,
        
        ensayo_slump: req.body.ensayo_slump,
        obs_slump: req.body.obs_slump,
        temperatura_concreto: req.body.temperatura_concreto,
        obs_temperatura: req.body.obs_temperatura,
        toma_testigos: req.body.toma_testigos,
        obs_testigos: req.body.obs_testigos,
        probetas_cantidad: req.body.probetas_cantidad || 2,
        
        altura_caida: req.body.altura_caida,
        obs_caida: req.body.obs_caida,
        compactacion_vibrado: req.body.compactacion_vibrado,
        obs_vibrado: req.body.obs_vibrado,
        acabado_superficial: req.body.acabado_superficial,
        obs_acabado: req.body.obs_acabado,
        
        inicio_curado: req.body.inicio_curado,
        obs_inicio_curado: req.body.obs_inicio_curado,
        metodo_curado: req.body.metodo_curado,
        obs_metodo_curado: req.body.obs_metodo_curado
      },
      fotos: urlsFotos 
    });

    await nuevoProtocolo.save();
    res.status(201).json({ mensaje: "✅ Protocolo y fotos guardados con éxito" });
  } catch (error) {
    console.error("❌ Error en guardado:", error);
    res.status(500).json({ error: "Error interno: " + error.message });
  }
});

// 5. Ruta de consulta (Historial) - NO MODIFICADO
app.get('/api/protocolos', async (req, res) => {
  try {
    const lista = await Protocolo.find().sort({ createdAt: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener lista" });
  }
});

// --- SECCIÓN CORREGIDA: ESTANQUIDAD ---

const Estanquidad = require('./models/estanquidad');

// Ruta para guardar protocolos de estanquidad con FOTOS
app.post('/api/estanquidad', upload.fields([
  { name: 'foto_antes', maxCount: 1 },
  { name: 'foto_durante', maxCount: 1 },
  { name: 'foto_despues', maxCount: 1 }
]), async (req, res) => {
    try {
        const urlsFotos = {};
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                urlsFotos[key] = req.files[key][0].path;
            });
        }

        // Mapeo manual para asegurar que los campos del FormData coincidan con tu modelo de Mongoose
        app.post('/api/estanquidad', upload.fields([
  { name: 'foto_antes', maxCount: 1 },
  { name: 'foto_durante', maxCount: 1 },
  { name: 'foto_despues', maxCount: 1 }
]), async (req, res) => {
    try {
        const urlsFotos = {};
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                urlsFotos[key] = req.files[key][0].path;
            });
        }

        // Construimos el objeto siguiendo la estructura exacta de tu modelo EstanquidadSchema
        const nuevaPrueba = new Estanquidad({
            nro_protocolo: req.body.nro_protocolo,
            fecha: req.body.fecha,
            datos_elemento: {
                id_buzon: req.body.id_buzon,
                material_tuberia: req.body.material_tuberia,
                diametro_d: req.body.diam_d,
                altura_h: req.body.alt_h
            },
            resultados: {
                perdida_max_permitida_vp: req.body.vp_max,
                lectura_inicial: req.body.l_ini,
                lectura_final: req.body.l_fin,
                resultado_final: req.body.veredicto
            },
            controles: {
                limpieza_interior: { estado: req.body['st_1.1'], obs: req.body['obs_1.1'] },
                sellado_tuberias: { estado: req.body['st_1.2'], obs: req.body['obs_1.2'] },
                conexion_sello_estanco: { estado: req.body['st_1.3'], obs: req.body['obs_1.3'] },
                periodo_saturacion: { estado: req.body['st_2.1'], obs: req.body['obs_2.1'] },
                marcado_nivel_inicial: { estado: req.body['st_2.2'], obs: req.body['obs_2.2'] },
                tiempo_prueba_minimo: { estado: req.body['st_2.3'], obs: req.body['obs_2.3'] },
                ausencia_filtraciones: { estado: req.body['st_3.1'], obs: req.body['obs_3.1'] },
                descenso_tolerancia: { estado: req.body['st_3.2'], obs: req.body['obs_3.2'] }
            },
            fotos: urlsFotos 
        });

        await nuevaPrueba.save();
        res.status(201).json({ mensaje: "✅ Guardado correctamente", id: nuevaPrueba._id });
    } catch (error) {
        console.error("❌ Error en estanquidad:", error);
        res.status(500).json({ error: "Error al guardar: " + error.message });
    }
});

// --- FIN SECCIÓN CORREGIDA ---

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
