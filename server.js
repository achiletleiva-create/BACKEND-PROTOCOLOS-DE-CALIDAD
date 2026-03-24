require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Protocolo = require('./models/protocolo');
const Estanquidad = require('./models/estanquidad');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN CLOUDINARY ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Protocolos_Victor_Larco',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  },
});

// ✅ NUEVO: Storage específico para PDFs en Cloudinary
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Protocolos_Victor_Larco/PDFs',
    allowed_formats: ['pdf'],
    resource_type: 'raw'
  },
});

const upload = multer({ storage: storage });
const uploadPdf = multer({ storage: pdfStorage }); // ✅ NUEVO: multer para PDFs

// --- CONEXIÓN MONGODB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a la BD de Ingeniería'))
  .catch(err => console.error('❌ Error de conexión:', err));


// ============================================================
//  RUTAS - PROTOCOLOS DE CONCRETO
// ============================================================

// GET - Obtener todos los protocolos de concreto
app.get('/api/protocolos', async (req, res) => {
  try {
    const protocolos = await Protocolo.find().sort({ createdAt: -1 });
    res.json(protocolos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener protocolos: " + error.message });
  }
});

// GET - Siguiente correlativo de concreto
app.get('/api/protocolos/siguiente-correlativo', async (req, res) => {
  try {
    const ultimo = await Protocolo.findOne().sort({ createdAt: -1 });
    const anio = new Date().getFullYear();
    if (!ultimo) return res.json({ correlativo: `CONC-001-${anio}` });
    const num = parseInt(ultimo.nro_protocolo.split('-')[1]) + 1;
    res.json({ correlativo: `CONC-${String(num).padStart(3, '0')}-${anio}` });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener correlativo: " + error.message });
  }
});

// GET - Obtener un protocolo por ID
app.get('/api/protocolos/:id', async (req, res) => {
  try {
    const protocolo = await Protocolo.findById(req.params.id);
    if (!protocolo) return res.status(404).json({ error: "Protocolo no encontrado" });
    res.json(protocolo);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener protocolo: " + error.message });
  }
});

// POST - Guardar nuevo protocolo de concreto
app.post('/api/protocolos', upload.fields([
  { name: 'foto_slump',     maxCount: 1 },
  { name: 'foto_mezclado',  maxCount: 1 },
  { name: 'foto_encofrado', maxCount: 1 },
  { name: 'foto_probetas',  maxCount: 1 },
  { name: 'foto_vibrado',   maxCount: 1 },
  { name: 'foto_curado',    maxCount: 1 }
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
        elemento:       req.body.elemento,
        resistencia_fc: req.body.resistencia_fc,
        ubicacion:      "Víctor Larco Herrera"
      },
      controles: {
        limpieza_niveles:       req.body.limpieza_niveles,
        obs_limpieza:           req.body.obs_limpieza,
        estanqueidad_encofrado: req.body.estanqueidad_encofrado,
        obs_estanqueidad:       req.body.obs_estanqueidad,
        aplicacion_desmoldante: req.body.aplicacion_desmoldante,
        obs_desmoldante:        req.body.obs_desmoldante,
        agregados_limpios:      req.body.agregados_limpios,
        obs_agregados:          req.body.obs_agregados,
        cemento_vigente:        req.body.cemento_vigente,
        obs_cemento:            req.body.obs_cemento,
        dosificacion_mezcla:    req.body.dosificacion_mezcla,
        obs_dosificacion:       req.body.obs_dosificacion,
        tiempo_mezclado:        req.body.tiempo_mezclado,
        obs_tiempo_mezcla:      req.body.obs_tiempo_mezcla,
        relacion_agua_cemento:  req.body.relacion_agua_cemento,
        obs_agua_cemento:       req.body.obs_agua_cemento,
        ensayo_slump:           req.body.ensayo_slump,
        obs_slump:              req.body.obs_slump,
        temperatura_concreto:   req.body.temperatura_concreto,
        obs_temperatura:        req.body.obs_temperatura,
        toma_testigos:          req.body.toma_testigos,
        obs_testigos:           req.body.obs_testigos,
        probetas_cantidad:      req.body.probetas_cantidad || 2,
        altura_caida:           req.body.altura_caida,
        obs_caida:              req.body.obs_caida,
        compactacion_vibrado:   req.body.compactacion_vibrado,
        obs_vibrado:            req.body.obs_vibrado,
        acabado_superficial:    req.body.acabado_superficial,
        obs_acabado:            req.body.obs_acabado,
        inicio_curado:          req.body.inicio_curado,
        obs_inicio_curado:      req.body.obs_inicio_curado,
        metodo_curado:          req.body.metodo_curado,
        obs_metodo_curado:      req.body.obs_metodo_curado
      },
      fotos: urlsFotos
    });
    await nuevoProtocolo.save();
    // ✅ NUEVO: Devuelve el _id para que el frontend pueda subir el PDF después
    res.status(201).json({ 
      mensaje: "✅ Protocolo y fotos guardados con éxito",
      id: nuevoProtocolo._id 
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno: " + error.message });
  }
});

// ✅ NUEVO: PATCH - Subir PDF a Cloudinary y guardar URL en el protocolo
app.patch('/api/protocolos/:id/pdf', uploadPdf.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se recibió ningún PDF" });
    const pdf_url = req.file.path;
    await Protocolo.findByIdAndUpdate(req.params.id, { pdf_url: pdf_url });
    res.json({ mensaje: "✅ PDF guardado en Cloudinary", pdf_url: pdf_url });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar PDF: " + error.message });
  }
});


// ============================================================
//  RUTAS - PRUEBA DE ESTANQUIDAD
// ============================================================

// GET - Obtener todos los registros de estanquidad
app.get('/api/estanquidad', async (req, res) => {
  try {
    const registros = await Estanquidad.find().sort({ createdAt: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener registros: " + error.message });
  }
});

// GET - Siguiente correlativo de estanquidad
app.get('/api/estanquidad/siguiente-correlativo', async (req, res) => {
  try {
    const ultimo = await Estanquidad.findOne().sort({ createdAt: -1 });
    const anio = new Date().getFullYear();
    if (!ultimo) return res.json({ correlativo: `EST-001-${anio}` });
    const num = parseInt(ultimo.nro_protocolo.split('-')[1]) + 1;
    res.json({ correlativo: `EST-${String(num).padStart(3, '0')}-${anio}` });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener correlativo: " + error.message });
  }
});

// GET - Obtener un registro de estanquidad por ID
app.get('/api/estanquidad/:id', async (req, res) => {
  try {
    const registro = await Estanquidad.findById(req.params.id);
    if (!registro) return res.status(404).json({ error: "Registro no encontrado" });
    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener registro: " + error.message });
  }
});

// POST - Guardar nueva prueba de estanquidad
app.post('/api/estanquidad', upload.fields([
  { name: 'foto_antes',   maxCount: 1 },
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
    const nuevaPrueba = new Estanquidad({
      nro_protocolo: req.body.nro_protocolo,
      fecha:         req.body.fecha,
      datos_elemento: {
        id_buzon:         req.body.id_buzon,
        material_tuberia: req.body.material_tuberia,
        diametro_d:       req.body.diam_d,
        altura_h:         req.body.alt_h
      },
      resultados: {
        perdida_max_permitida_vp: req.body.vp_max,
        lectura_inicial:          req.body.l_ini,
        lectura_final:            req.body.l_fin,
        resultado_final:          req.body.veredicto
      },
      controles: {
        limpieza_interior:      { estado: req.body['st_1.1'], obs: req.body['obs_1.1'] },
        sellado_tuberias:       { estado: req.body['st_1.2'], obs: req.body['obs_1.2'] },
        conexion_sello_estanco: { estado: req.body['st_1.3'], obs: req.body['obs_1.3'] },
        periodo_saturacion:     { estado: req.body['st_2.1'], obs: req.body['obs_2.1'] },
        marcado_nivel_inicial:  { estado: req.body['st_2.2'], obs: req.body['obs_2.2'] },
        tiempo_prueba_minimo:   { estado: req.body['st_2.3'], obs: req.body['obs_2.3'] },
        ausencia_filtraciones:  { estado: req.body['st_3.1'], obs: req.body['obs_3.1'] },
        descenso_tolerancia:    { estado: req.body['st_3.2'], obs: req.body['obs_3.2'] }
      },
      fotos: {
        foto_antes:   urlsFotos.foto_antes   || "",
        foto_durante: urlsFotos.foto_durante  || "",
        foto_despues: urlsFotos.foto_despues  || ""
      }
    });
    await nuevaPrueba.save();
    res.status(201).json({ mensaje: "✅ Guardado correctamente", id: nuevaPrueba._id });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar: " + error.message });
  }
});


// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
