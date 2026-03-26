const Buzon = require('../models/buzon');
const { attachPdfToRecord } = require('./pdfService');

function collectPhotoUrls(files) {
  const urlsFotos = {};
  if (files) Object.keys(files).forEach(k => { urlsFotos[k] = files[k][0].path; });
  return urlsFotos;
}

async function listAll() { return Buzon.find().sort({ createdAt: -1 }); }
async function getById(id) { return Buzon.findById(id); }

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const ultimo = await Buzon.findOne({ nro_protocolo: new RegExp(`-${anio}$`) }).sort({ createdAt: -1 });
  if (!ultimo) return { correlativo: `BUZ-001-${anio}` };
  const partes = ultimo.nro_protocolo.split('-');
  if (partes.length === 3 && partes[2] === anio.toString()) {
    const num = parseInt(partes[1], 10) + 1;
    return { correlativo: `BUZ-${String(num).padStart(3, '0')}-${anio}` };
  }
  return { correlativo: `BUZ-001-${anio}` };
}

async function createFromBody(body, files) {
  if (!body.codigo_buzon || body.codigo_buzon.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Código de Buzón' es obligatorio." };

  const urlsFotos = collectPhotoUrls(files);
  const nuevo = new Buzon({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_identificacion: {
      codigo_buzon: body.codigo_buzon,
      calle_pasaje: body.calle_pasaje,
      tipo_buzon: body.tipo_buzon,
      fecha_vaciado: body.fecha_vaciado
    },
    control_excavacion: {
      fondo_nivelado_compactado: body.exc_fondo,
      solado_limpieza: body.exc_solado,
      cotas_invertidas: body.exc_cotas
    },
    control_concreto: {
      resistencia_fc_real: body.fc_real,
      resistencia_estado: body.fc_estado,
      diametro_interior_real: body.diam_real,
      diametro_estado: body.diam_estado,
      espesor_muro_real: body.esp_real,
      espesor_estado: body.esp_estado,
      tipo_cemento_real: body.cem_real,
      cemento_estado: body.cem_estado,
      slump_real: body.slump_real,
      slump_estado: body.slump_estado
    },
    acabados: {
      media_cana: body.ac_media_cana,
      tarrajeo_interno: body.ac_tarrajeo,
      escalines: body.ac_escalines,
      tapa_buzon: body.ac_tapa,
      cota_tapa: body.ac_cota_tapa
    },
    observaciones: body.observaciones,
    fotos: {
      foto_excavacion: urlsFotos.foto_excavacion || '',
      foto_estructura: urlsFotos.foto_estructura || '',
      foto_acabados: urlsFotos.foto_acabados || ''
    }
  });
  await nuevo.save();
  return { ok: true, id: nuevo._id, mensaje: '✅ Protocolo de Buzón guardado con éxito' };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(Buzon, id, file, {
    notFoundError: '❌ No se encontró el registro de buzón asociado a este ID.'
  });
}

module.exports = { listAll, getById, siguienteCorrelativo, createFromBody, attachPdf };
