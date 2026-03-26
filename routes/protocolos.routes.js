const express = require('express');
const { upload, uploadPdf } = require('../middleware/upload');
const protocoloService = require('../services/protocoloService');

const router = express.Router();

const FOTOS_PROTOCOLO = [
  { name: 'foto_slump', maxCount: 1 },
  { name: 'foto_mezclado', maxCount: 1 },
  { name: 'foto_encofrado', maxCount: 1 },
  { name: 'foto_probetas', maxCount: 1 },
  { name: 'foto_vibrado', maxCount: 1 },
  { name: 'foto_curado', maxCount: 1 }
];

router.get('/', async (req, res) => {
  try {
    const protocolos = await protocoloService.listAll();
    res.json(protocolos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener protocolos: ' + error.message });
  }
});

router.get('/siguiente-correlativo', async (req, res) => {
  try {
    const data = await protocoloService.siguienteCorrelativo();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener correlativo: ' + error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const protocolo = await protocoloService.getById(req.params.id);
    if (!protocolo) return res.status(404).json({ error: 'Protocolo no encontrado' });
    res.json(protocolo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener protocolo: ' + error.message });
  }
});

router.post('/', upload.fields(FOTOS_PROTOCOLO), async (req, res) => {
  try {
    const result = await protocoloService.createFromBody(req.body, req.files);
    if (!result.ok) {
      return res.status(result.status).json({ error: result.error });
    }
    res.status(201).json({
      mensaje: result.mensaje,
      id: result.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno: ' + error.message });
  }
});

router.patch('/:id/pdf', uploadPdf.single('pdf'), async (req, res) => {
  try {
    const result = await protocoloService.attachPdf(req.params.id, req.file);
    if (!result.ok) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json({
      mensaje: '✅ PDF guardado correctamente en la nube',
      pdf_url: result.pdf_url
    });
  } catch (error) {
    console.error('Error en subida de PDF de concreto:', error);
    res.status(500).json({
      error:
        '⚠️ Ocurrió un problema interno al guardar el PDF. Por favor, inténtalo de nuevo más tarde.'
    });
  }
});

module.exports = router;
