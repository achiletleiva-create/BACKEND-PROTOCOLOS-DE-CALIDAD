const Relleno = require('../models/relleno');
const { attachPdfToRecord } = require('./pdfService');

function collectPhotoUrls(files) {
  const urlsFotos = {};
  if (files) Object.keys(files).forEach(k => { urlsFotos[k] = files[k][0].path; });
  return urlsFotos;
}

async function listAll() { return Relleno.find().sort({ createdAt: -1 }); }
async function getById(id) { return Relleno.findById(id); }

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const prefijo = `REL`;
  const regex = new RegExp(`^${prefijo}-\\d+-${anio}$`);
  const todos = await Relleno.find({ nro_protocolo: regex }, { nro_protocolo: 1 });
  if (!todos.length) return { correlativo: `${prefijo}-001-${anio}` };
  const maxNum = todos.reduce((max, doc) => {
    const n = parseInt(doc.nro_protocolo.split('-')[1], 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return { correlativo: `${prefijo}-${String(maxNum + 1).padStart(3, '0')}-${anio}` };
}

async function createFromBody(body, files) {
  if (!body.sector_calle || body.sector_calle.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Sector / Calle' es obligatorio." };

  // Parsear ensayos de compactación enviados como JSON string
  let ensayos = [];
  try {
    ensayos = body.ensayos ? JSON.parse(body.ensayos) : [];
  } catch (e) { ensayos = []; }

  const urlsFotos = collectPhotoUrls(files);
  const nuevo = new Relleno({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_identificacion: {
      sector_calle: body.sector_calle,
      tramo_bz_inicio: body.tramo_bz_inicio,
      tramo_bz_fin: body.tramo_bz_fin,
      tipo_via: body.tipo_via
    },
    especificaciones: {
      cama_apoyo: body.esp_cama,
      relleno_proteccion: body.esp_relleno,
      espesor_capas: body.esp_espesor,
      nivel_cierre: body.esp_nivel,
      compactacion_porcentaje: body.esp_compactacion
    },
    ensayos_compactacion: ensayos,
    laboratorio: {
      mds_proctor: body.lab_mds,
      optimo_contenido_humedad: body.lab_humedad
    },
    equipos: {
      plancha_compactadora: body.eq_plancha === 'true',
      vibroapisonador: body.eq_vibro === 'true',
      motobomba: body.eq_moto === 'true',
      otros: body.eq_otros
    },
    observaciones: body.observaciones,
    fotos: {
      foto_relleno: urlsFotos.foto_relleno || '',
      foto_compactacion: urlsFotos.foto_compactacion || '',
      foto_ensayo: urlsFotos.foto_ensayo || ''
    }
  });
  await nuevo.save();
  return { ok: true, id: nuevo._id, mensaje: '✅ Protocolo de Relleno guardado con éxito' };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(Relleno, id, file, {
    notFoundError: '❌ No se encontró el registro de relleno asociado a este ID.'
  });
}

module.exports = { listAll, getById, siguienteCorrelativo, createFromBody, attachPdf };
