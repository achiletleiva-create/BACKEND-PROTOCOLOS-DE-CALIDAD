const Tuberia = require('../models/tuberia');
const { attachPdfToRecord } = require('./pdfService');

function collectPhotoUrls(files) {
  const urlsFotos = {};
  if (files) Object.keys(files).forEach(k => { urlsFotos[k] = files[k][0].path; });
  return urlsFotos;
}

async function listAll() { return Tuberia.find().sort({ createdAt: -1 }); }
async function getById(id) { return Tuberia.findById(id); }

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const ultimo = await Tuberia.findOne({ nro_protocolo: new RegExp(`-${anio}$`) }).sort({ createdAt: -1 });
  if (!ultimo) return { correlativo: `TUB-001-${anio}` };
  const partes = ultimo.nro_protocolo.split('-');
  if (partes.length === 3 && partes[2] === anio.toString()) {
    const num = parseInt(partes[1], 10) + 1;
    return { correlativo: `TUB-${String(num).padStart(3, '0')}-${anio}` };
  }
  return { correlativo: `TUB-001-${anio}` };
}

async function createFromBody(body, files) {
  if (!body.tramo_bz_inicio || body.tramo_bz_inicio.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Buzón Inicio' es obligatorio." };
  if (!body.tramo_bz_fin || body.tramo_bz_fin.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Buzón Fin' es obligatorio." };

  const urlsFotos = collectPhotoUrls(files);
  const nuevo = new Tuberia({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_ubicacion: {
      tramo_bz_inicio: body.tramo_bz_inicio,
      tramo_bz_fin: body.tramo_bz_fin,
      calle_pasaje: body.calle_pasaje,
      tipo_tuberia: body.tipo_tuberia,
      diametro_dn: body.diametro_dn,
      sdr_serie: body.sdr_serie,
      longitud_tramo: body.longitud_tramo
    },
    inspeccion_previa: {
      certificado_calidad: body.pre_certificado,
      integridad_fisica: body.pre_integridad,
      limpieza_espiga_campana: body.pre_limpieza,
      lubricante_fabricante: body.pre_lubricante,
      anillo_elastomerico: body.pre_anillo
    },
    control_topografico: {
      cota_tapa_bz_llegada: body.top_cota_tapa,
      cota_invertida_salida: body.top_cota_invertida,
      pendiente: body.top_pendiente,
      cama_apoyo_espesor: body.top_cama_apoyo || 0.10
    },
    verificacion_instalacion: {
      tuberia_sobre_cama: body.ins_cama,
      campana_contra_flujo: body.ins_campana,
      alineamiento_horizontal: body.ins_alineamiento,
      prueba_espejo: body.ins_espejo
    },
    observaciones: body.observaciones,
    fotos: {
      foto_material: urlsFotos.foto_material || '',
      foto_instalacion: urlsFotos.foto_instalacion || '',
      foto_alineamiento: urlsFotos.foto_alineamiento || ''
    }
  });
  await nuevo.save();
  return { ok: true, id: nuevo._id, mensaje: '✅ Protocolo de Tubería guardado con éxito' };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(Tuberia, id, file, {
    notFoundError: '❌ No se encontró el registro de tubería asociado a este ID.'
  });
}

module.exports = { listAll, getById, siguienteCorrelativo, createFromBody, attachPdf };
