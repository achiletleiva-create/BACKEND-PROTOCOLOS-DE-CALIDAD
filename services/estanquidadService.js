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
  const ultimo = await Estanquidad.findOne().sort({ nro_protocolo: -1 });
  if (!ultimo) return { correlativo: `EST-001-${anio}` };
  const partes = ultimo.nro_protocolo.split('-');
  if (partes.length === 3 && partes[2] === anio.toString()) {
    const num = parseInt(partes[1], 10) + 1;
    return { correlativo: `EST-${String(num).padStart(3, '0')}-${anio}` };
  }
  return { correlativo: `EST-001-${anio}` };
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
