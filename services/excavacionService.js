const Excavacion = require('../models/excavacion');
const { attachPdfToRecord } = require('./pdfService');

function collectPhotoUrls(files) {
  const urlsFotos = {};
  if (files) Object.keys(files).forEach(k => { urlsFotos[k] = files[k][0].path; });
  return urlsFotos;
}

async function listAll() { return Excavacion.find().sort({ createdAt: -1 }); }
async function getById(id) { return Excavacion.findById(id); }

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const ultimo = await Excavacion.findOne({ nro_protocolo: new RegExp(`-${anio}$`) }).sort({ createdAt: -1 });
  if (!ultimo) return { correlativo: `EXC-001-${anio}` };
  const partes = ultimo.nro_protocolo.split('-');
  if (partes.length === 3 && partes[2] === anio.toString()) {
    const num = parseInt(partes[1], 10) + 1;
    return { correlativo: `EXC-${String(num).padStart(3, '0')}-${anio}` };
  }
  return { correlativo: `EXC-001-${anio}` };
}

async function createFromBody(body, files) {
  if (!body.tramo_bz_inicio || body.tramo_bz_inicio.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Buzón Inicio' es obligatorio." };
  if (!body.tramo_bz_fin || body.tramo_bz_fin.trim() === '')
    return { ok: false, status: 400, error: "El campo 'Buzón Fin' es obligatorio." };

  const urlsFotos = collectPhotoUrls(files);
  const nuevo = new Excavacion({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_identificacion: {
      tramo_bz_inicio: body.tramo_bz_inicio,
      tramo_bz_fin: body.tramo_bz_fin,
      calle_pasaje: body.calle_pasaje,
      metodo_excavacion: body.metodo_excavacion,
      tipo_terreno: body.tipo_terreno
    },
    control_topografico: {
      ancho_zanja_proyecto: body.ancho_proyecto,
      ancho_zanja_realizado: body.ancho_realizado,
      profundidad_inicio_proyecto: body.prof_ini_proyecto,
      profundidad_inicio_realizado: body.prof_ini_realizado,
      profundidad_fin_proyecto: body.prof_fin_proyecto,
      profundidad_fin_realizado: body.prof_fin_realizado,
      cota_fondo_proyecto: body.cota_proyecto,
      cota_fondo_realizado: body.cota_realizado
    },
    condiciones_seguridad: {
      senalizacion_cerco: body.seg_senalizacion,
      fondo_nivelado: body.seg_fondo,
      entibado: body.seg_entibado,
      zanja_seca: body.seg_seca,
      material_excedente: body.seg_excedente
    },
    observaciones: body.observaciones,
    fotos: {
      foto_inicio: urlsFotos.foto_inicio || '',
      foto_fondo: urlsFotos.foto_fondo || '',
      foto_seguridad: urlsFotos.foto_seguridad || ''
    }
  });
  await nuevo.save();
  return { ok: true, id: nuevo._id, mensaje: '✅ Protocolo de Excavación guardado con éxito' };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(Excavacion, id, file, {
    notFoundError: '❌ No se encontró el registro de excavación asociado a este ID.'
  });
}

module.exports = { listAll, getById, siguienteCorrelativo, createFromBody, attachPdf };
