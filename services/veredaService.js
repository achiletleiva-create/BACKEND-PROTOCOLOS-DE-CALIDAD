const Vereda = require('../models/vereda');
const { attachPdfToRecord } = require('./pdfService');

function collectPhotoUrls(files) {
  const urlsFotos = {};
  if (files) Object.keys(files).forEach(k => { urlsFotos[k] = files[k][0].path; });
  return urlsFotos;
}

async function listAll() { return Vereda.find().sort({ createdAt: -1 }); }
async function getById(id) { return Vereda.findById(id); }

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const ultimo = await Vereda.findOne({ nro_protocolo: new RegExp(`-${anio}$`) }).sort({ createdAt: -1 });
  if (!ultimo) return { correlativo: `VER-001-${anio}` };
  const partes = ultimo.nro_protocolo.split('-');
  if (partes.length === 3 && partes[2] === anio.toString()) {
    const num = parseInt(partes[1], 10) + 1;
    return { correlativo: `VER-${String(num).padStart(3, '0')}-${anio}` };
  }
  return { correlativo: `VER-001-${anio}` };
}

async function createFromBody(body, files) {
  if (!body.frente_trabajo || body.frente_trabajo.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Frente de Trabajo' es obligatorio." };

  let resanes = [];
  try {
    resanes = body.resanes ? JSON.parse(body.resanes) : [];
  } catch (e) { resanes = []; }

  // Calcular área total
  const areaTotal = resanes.reduce((sum, r) => sum + (parseFloat(r.area) || 0), 0);

  const urlsFotos = collectPhotoUrls(files);
  const nuevo = new Vereda({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_campo: {
      frente_trabajo: body.frente_trabajo,
      sector_pasaje: body.sector_pasaje,
      nro_informe_lab: body.nro_informe_lab
    },
    cumplimiento_normativo: {
      preparacion_mezclado: body.nor_preparacion,
      resistencia_compresion: body.nor_resistencia,
      espesor_vereda: body.nor_espesor,
      pendiente_transversal: body.nor_pendiente,
      cemento_sulfatos: body.nor_cemento
    },
    resanes,
    area_total: areaTotal,
    observaciones: body.observaciones,
    fotos: {
      foto_antes: urlsFotos.foto_antes || '',
      foto_vaciado: urlsFotos.foto_vaciado || '',
      foto_acabado: urlsFotos.foto_acabado || ''
    }
  });
  await nuevo.save();
  return { ok: true, id: nuevo._id, mensaje: '✅ Protocolo de Vereda guardado con éxito' };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(Vereda, id, file, {
    notFoundError: '❌ No se encontró el registro de vereda asociado a este ID.'
  });
}

module.exports = { listAll, getById, siguienteCorrelativo, createFromBody, attachPdf };
