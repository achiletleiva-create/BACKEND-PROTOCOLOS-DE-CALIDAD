const PruebaHidraulica = require('../models/pruebaHidraulica');
const { attachPdfToRecord } = require('./pdfService');

function collectPhotoUrls(files) {
  const urlsFotos = {};
  if (files) Object.keys(files).forEach(k => { urlsFotos[k] = files[k][0].path; });
  return urlsFotos;
}

async function listAll() { return PruebaHidraulica.find().sort({ createdAt: -1 }); }
async function getById(id) { return PruebaHidraulica.findById(id); }

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const ultimo = await PruebaHidraulica.findOne({ nro_protocolo: new RegExp(`-${anio}$`) }).sort({ createdAt: -1 });
  if (!ultimo) return { correlativo: `HID-001-${anio}` };
  const partes = ultimo.nro_protocolo.split('-');
  if (partes.length === 3 && partes[2] === anio.toString()) {
    const num = parseInt(partes[1], 10) + 1;
    return { correlativo: `HID-${String(num).padStart(3, '0')}-${anio}` };
  }
  return { correlativo: `HID-001-${anio}` };
}

async function createFromBody(body, files) {
  if (!body.bz_inicio || body.bz_inicio.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Buzón Inicio' es obligatorio." };
  if (!body.bz_fin || body.bz_fin.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Buzón Fin' es obligatorio." };

  const urlsFotos = collectPhotoUrls(files);
  const nuevo = new PruebaHidraulica({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_tramo: {
      bz_inicio: body.bz_inicio,
      bz_fin: body.bz_fin,
      material_diametro: body.material_diametro,
      longitud_tramo: body.longitud_tramo,
      hora_puesta_servicio: body.hora_puesta_servicio
    },
    control_alineamiento: {
      cota_invertida_salida: body.alin_cota_salida,
      cota_invertida_llegada: body.alin_cota_llegada,
      pendiente_calculada: body.alin_pendiente,
      prueba_espejo: body.alin_espejo,
      estado_alineamiento: body.alin_estado
    },
    verificacion_operatividad: {
      flujo_libre_aguas_residuales: body.op_flujo,
      uniones_empalmes_estancos: body.op_uniones,
      limpieza_ducto: body.op_limpieza,
      recubrimiento_minimo: body.op_recubrimiento,
      tramo_sin_represamiento: body.op_represamiento
    },
    resultado_final: body.resultado_final || 'APROBADO',
    observaciones: body.observaciones,
    fotos: {
      foto_antes: urlsFotos.foto_antes || '',
      foto_durante: urlsFotos.foto_durante || '',
      foto_despues: urlsFotos.foto_despues || ''
    }
  });
  await nuevo.save();
  return { ok: true, id: nuevo._id, mensaje: '✅ Prueba Hidráulica guardada con éxito' };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(PruebaHidraulica, id, file, {
    notFoundError: '❌ No se encontró el registro de prueba hidráulica asociado a este ID.'
  });
}

module.exports = { listAll, getById, siguienteCorrelativo, createFromBody, attachPdf };
