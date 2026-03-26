const Estanquidad = require('../models/estanquidad');
const { attachPdfToRecord } = require('./pdfService');

function collectPhotoUrls(files) {
  const urlsFotos = {};
  if (files) {
    Object.keys(files).forEach((key) => {
      urlsFotos[key] = files[key][0].path;
    });
  }
  return urlsFotos;
}

async function listAll() {
  return Estanquidad.find().sort({ createdAt: -1 });
}

async function getById(id) {
  return Estanquidad.findById(id);
}

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const prefijo = `EST`;
  const regex = new RegExp(`^${prefijo}-\\d+-${anio}$`);
  const todos = await Estanquidad.find({ nro_protocolo: regex }, { nro_protocolo: 1 });
  if (!todos.length) return { correlativo: `${prefijo}-001-${anio}` };
  const maxNum = todos.reduce((max, doc) => {
    const n = parseInt(doc.nro_protocolo.split('-')[1], 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return { correlativo: `${prefijo}-${String(maxNum + 1).padStart(3, '0')}-${anio}` };
}

async function createFromBody(body, files) {
  if (!body.id_buzon || body.id_buzon.trim() === '') {
    return { ok: false, status: 400, error: "El campo 'id_buzon' es obligatorio." };
  }
  if (!body.diam_d || isNaN(parseFloat(body.diam_d))) {
    return { ok: false, status: 400, error: "El campo 'diámetro D' es obligatorio y debe ser numérico." };
  }
  if (!body.alt_h || isNaN(parseFloat(body.alt_h))) {
    return { ok: false, status: 400, error: "El campo 'altura H' es obligatorio y debe ser numérico." };
  }

  const urlsFotos = collectPhotoUrls(files);

  const nuevaPrueba = new Estanquidad({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_elemento: {
      id_buzon: body.id_buzon,
      material_tuberia: body.material_tuberia,
      diametro_d: body.diam_d,
      altura_h: body.alt_h
    },
    resultados: {
      perdida_max_permitida_vp: body.vp_max,
      lectura_inicial: body.l_ini,
      lectura_final: body.l_fin,
      resultado_final: body.veredicto
    },
    controles: {
      limpieza_interior: { estado: body['st_1.1'], obs: body['obs_1.1'] },
      sellado_tuberias: { estado: body['st_1.2'], obs: body['obs_1.2'] },
      conexion_sello_estanco: { estado: body['st_1.3'], obs: body['obs_1.3'] },
      periodo_saturacion: { estado: body['st_2.1'], obs: body['obs_2.1'] },
      marcado_nivel_inicial: { estado: body['st_2.2'], obs: body['obs_2.2'] },
      tiempo_prueba_minimo: { estado: body['st_2.3'], obs: body['obs_2.3'] },
      ausencia_filtraciones: { estado: body['st_3.1'], obs: body['obs_3.1'] },
      descenso_tolerancia: { estado: body['st_3.2'], obs: body['obs_3.2'] }
    },
    fotos: {
      foto_antes: urlsFotos.foto_antes || '',
      foto_durante: urlsFotos.foto_durante || '',
      foto_despues: urlsFotos.foto_despues || ''
    }
  });

  await nuevaPrueba.save();
  return { ok: true, id: nuevaPrueba._id, mensaje: '✅ Guardado correctamente' };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(Estanquidad, id, file, {
    notFoundError:
      '❌ No se encontró el registro asociado a este ID. Asegúrate de haber guardado primero los datos.'
  });
}

module.exports = {
  listAll,
  getById,
  siguienteCorrelativo,
  createFromBody,
  attachPdf
};
