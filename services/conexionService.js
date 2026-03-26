const Conexion = require('../models/conexion');
const { attachPdfToRecord } = require('./pdfService');

function collectPhotoUrls(files) {
  const urlsFotos = {};
  if (files) Object.keys(files).forEach(k => { urlsFotos[k] = files[k][0].path; });
  return urlsFotos;
}

async function listAll() { return Conexion.find().sort({ createdAt: -1 }); }
async function getById(id) { return Conexion.findById(id); }

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const prefijo = `CON`;
  const regex = new RegExp(`^${prefijo}-\\d+-${anio}$`);
  const todos = await Conexion.find({ nro_protocolo: regex }, { nro_protocolo: 1 });
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

  const urlsFotos = collectPhotoUrls(files);
  const nuevo = new Conexion({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_ubicacion: {
      calle_pasaje: body.calle_pasaje,
      manzana_lote: body.manzana_lote,
      nro_casa: body.nro_casa,
      tramo_bz_inicio: body.tramo_bz_inicio,
      tramo_bz_fin: body.tramo_bz_fin,
      tipo_colector: body.tipo_colector,
      diametro_dn: body.diametro_dn
    },
    materiales: {
      elemento_union: body.mat_union,
      tuberia_descarga: body.mat_tuberia,
      codos: body.mat_codos,
      caja_registro: body.mat_caja
    },
    control_instalacion: {
      profundidad_colector_proyecto: body.inst_prof_col_proy,
      profundidad_colector_ejecutado: body.inst_prof_col_ejec,
      profundidad_caja_registro_proyecto: body.inst_prof_caja_proy || 0.60,
      profundidad_caja_registro_ejecutado: body.inst_prof_caja_ejec,
      pendiente_proyecto: body.inst_pend_proy || 1.5,
      pendiente_ejecutado: body.inst_pend_ejec,
      angulo_empalme_45: body.inst_angulo
    },
    prueba_operatividad: {
      volumen_agua: body.prueba_volumen,
      resultado_red_matriz: body.prueba_resultado,
      estado_cachimba: body.prueba_cachimba
    },
    resultado_final: body.resultado_final || 'APROBADO',
    observaciones: body.observaciones,
    fotos: {
      foto_material: urlsFotos.foto_material || '',
      foto_instalacion: urlsFotos.foto_instalacion || '',
      foto_prueba: urlsFotos.foto_prueba || ''
    }
  });
  await nuevo.save();
  return { ok: true, id: nuevo._id, mensaje: '✅ Conexión Domiciliaria guardada con éxito' };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(Conexion, id, file, {
    notFoundError: '❌ No se encontró el registro de conexión domiciliaria asociado a este ID.'
  });
}

module.exports = { listAll, getById, siguienteCorrelativo, createFromBody, attachPdf };
