const ConexionTramo = require('../models/conexionTramo');
const { attachPdfToRecord } = require('./pdfService');

async function listAll() { return ConexionTramo.find().sort({ createdAt: -1 }); }
async function getById(id) { return ConexionTramo.findById(id); }

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const prefijo = 'CONT';
  const regex = new RegExp(`^${prefijo}-\\d+-${anio}$`);
  const todos = await ConexionTramo.find({ nro_protocolo: regex }, { nro_protocolo: 1 });
  if (!todos.length) return { correlativo: `${prefijo}-001-${anio}` };
  const maxNum = todos.reduce((max, doc) => {
    const n = parseInt(doc.nro_protocolo.split('-')[1], 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return { correlativo: `${prefijo}-${String(maxNum + 1).padStart(3, '0')}-${anio}` };
}

async function createFromBody(body, files) {
  if (!body.calle_pasaje || body.calle_pasaje.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Calle / Pasaje' es obligatorio." };

  const urlsFotos = {};
  if (files) Object.keys(files).forEach(k => { urlsFotos[k] = files[k][0].path; });

  let conexiones = [];
  try { conexiones = JSON.parse(body.conexiones || '[]'); } catch (_) {}

  // Calcular resultado del tramo
  const tieneRechazado = conexiones.some(c => c.resultado === 'RECHAZADO');

  const nuevo = new ConexionTramo({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_tramo: {
      calle_pasaje:   body.calle_pasaje,
      bz_inicio:      body.bz_inicio,
      bz_fin:         body.bz_fin,
      tipo_colector:  body.tipo_colector,
      diametro_dn:    body.diametro_dn,
      longitud_tramo: body.longitud_tramo
    },
    materiales: {
      elemento_union:   body.mat_union,
      tuberia_descarga: body.mat_tuberia,
      codos:            body.mat_codos,
      caja_registro:    body.mat_caja
    },
    conexiones,
    resultado_tramo: tieneRechazado ? 'RECHAZADO' : 'APROBADO',
    observaciones: body.observaciones,
    fotos: {
      foto_materiales:  urlsFotos.foto_materiales  || '',
      foto_instalacion: urlsFotos.foto_instalacion || '',
      foto_prueba:      urlsFotos.foto_prueba      || ''
    }
  });

  await nuevo.save();
  return { ok: true, id: nuevo._id, mensaje: '✅ Protocolo de Conexiones por Tramo guardado con éxito' };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(ConexionTramo, id, file, {
    notFoundError: '❌ No se encontró el registro de conexiones por tramo asociado a este ID.'
  });
}

module.exports = { listAll, getById, siguienteCorrelativo, createFromBody, attachPdf };
