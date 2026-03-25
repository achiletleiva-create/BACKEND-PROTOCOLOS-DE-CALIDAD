const Protocolo = require('../models/protocolo');
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
  return Protocolo.find().sort({ createdAt: -1 });
}

async function getById(id) {
  return Protocolo.findById(id);
}

async function siguienteCorrelativo() {
  const anio = new Date().getFullYear();
  const ultimo = await Protocolo.findOne().sort({ nro_protocolo: -1 });
  if (!ultimo) return { correlativo: `CONC-001-${anio}` };
  const partes = ultimo.nro_protocolo.split('-');
  if (partes.length === 3 && partes[2] === anio.toString()) {
    const num = parseInt(partes[1], 10) + 1;
    return { correlativo: `CONC-${String(num).padStart(3, '0')}-${anio}` };
  }
  return { correlativo: `CONC-001-${anio}` };
}

async function createFromBody(body, files) {
  if (!body.elemento || body.elemento.trim() === '') {
    return { ok: false, status: 400, error: "El campo 'elemento' es obligatorio." };
  }
  if (!body.resistencia_fc || body.resistencia_fc.trim() === '') {
    return { ok: false, status: 400, error: "El campo 'resistencia_fc' es obligatorio." };
  }

  const urlsFotos = collectPhotoUrls(files);

  const nuevoProtocolo = new Protocolo({
    nro_protocolo: body.nro_protocolo,
    fecha: body.fecha,
    datos_tecnicos: {
      elemento: body.elemento,
      resistencia_fc: body.resistencia_fc,
      ubicacion: 'Víctor Larco Herrera'
    },
    controles: {
      limpieza_niveles: body.limpieza_niveles,
      obs_limpieza: body.obs_limpieza,
      estanqueidad_encofrado: body.estanqueidad_encofrado,
      obs_estanqueidad: body.obs_estanqueidad,
      aplicacion_desmoldante: body.aplicacion_desmoldante,
      obs_desmoldante: body.obs_desmoldante,
      agregados_limpios: body.agregados_limpios,
      obs_agregados: body.obs_agregados,
      cemento_vigente: body.cemento_vigente,
      obs_cemento: body.obs_cemento,
      dosificacion_mezcla: body.dosificacion_mezcla,
      obs_dosificacion: body.obs_dosificacion,
      tiempo_mezclado: body.tiempo_mezclado,
      obs_tiempo_mezcla: body.obs_tiempo_mezcla,
      relacion_agua_cemento: body.relacion_agua_cemento,
      obs_agua_cemento: body.obs_agua_cemento,
      ensayo_slump: body.ensayo_slump,
      obs_slump: body.obs_slump,
      temperatura_concreto: body.temperatura_concreto,
      obs_temperatura: body.obs_temperatura,
      toma_testigos: body.toma_testigos,
      obs_testigos: body.obs_testigos,
      probetas_cantidad: body.probetas_cantidad || 2,
      altura_caida: body.altura_caida,
      obs_caida: body.obs_caida,
      compactacion_vibrado: body.compactacion_vibrado,
      obs_vibrado: body.obs_vibrado,
      acabado_superficial: body.acabado_superficial,
      obs_acabado: body.obs_acabado,
      inicio_curado: body.inicio_curado,
      obs_inicio_curado: body.obs_inicio_curado,
      metodo_curado: body.metodo_curado,
      obs_metodo_curado: body.obs_metodo_curado
    },
    fotos: urlsFotos
  });

  await nuevoProtocolo.save();
  return {
    ok: true,
    id: nuevoProtocolo._id,
    mensaje: '✅ Protocolo y fotos guardados con éxito'
  };
}

async function attachPdf(id, file) {
  return attachPdfToRecord(Protocolo, id, file, {
    notFoundError:
      '❌ No se encontró el protocolo asociado a este ID. Asegúrate de haber guardado primero los datos.'
  });
}

module.exports = {
  listAll,
  getById,
  siguienteCorrelativo,
  createFromBody,
  attachPdf
};
