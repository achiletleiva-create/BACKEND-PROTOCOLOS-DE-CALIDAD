const express = require('express');
const { upload, uploadPdf } = require('../middleware/upload');
const estanquidadService = require('../services/estanquidadService');

const router = express.Router();

const FOTOS_ESTANQUIDAD = [
  { name: 'foto_antes', maxCount: 1 },
  { name: 'foto_durante', maxCount: 1 },
  { name: 'foto_despues', maxCount: 1 }
];

router.get('/', async (req, res) => {
  try {
    const registros = await estanquidadService.listAll();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros: ' + error.message });
  }
});

router.get('/siguiente-correlativo', async (req, res) => {
  try {
    const data = await estanquidadService.siguienteCorrelativo();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener correlativo: ' + error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const registro = await estanquidadService.getById(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro: ' + error.message });
  }
});

router.post('/', upload.fields(FOTOS_ESTANQUIDAD), async (req, res) => {
  try {
    const result = await estanquidadService.createFromBody(req.body, req.files);
    if (!result.ok) {
      return res.status(result.status).json({ error: result.error });
    }
    res.status(201).json({ mensaje: result.mensaje, id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar: ' + error.message });
  }
});

router.patch('/:id/pdf', uploadPdf.single('pdf'), async (req, res) => {
  try {
    const result = await estanquidadService.attachPdf(req.params.id, req.file);
    if (!result.ok) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json({ mensaje: '✅ PDF guardado correctamente en la nube', pdf_url: result.pdf_url });
  } catch (error) {
    console.error('Error en subida de PDF de estanquidad:', error);
    res.status(500).json({ error: '⚠️ Ocurrió un problema interno al guardar el PDF. Por favor, inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;
