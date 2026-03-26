const { extractCloudinaryFileUrl } = require('../utils/cloudinaryUrl');

const ERR_NO_FILE =
  '⚠️ No se recibió ningún archivo PDF. Por favor, selecciona un PDF antes de continuar.';
const ERR_NO_URL =
  '⚠️ El PDF se subió pero Cloudinary no devolvió una URL pública válida. Revisa la configuración o los logs del servidor.';

async function attachPdfToRecord(Model, recordId, file, { notFoundError }) {
  if (!file) {
    return { ok: false, status: 400, error: ERR_NO_FILE };
  }

  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(recordId)) {
    return { ok: false, status: 400, error: '❌ El ID proporcionado no es válido.' };
  }

  const pdf_url = extractCloudinaryFileUrl(file);
  if (!pdf_url) {
    console.error('PDF subido pero sin URL válida en req.file:', {
      keys: file ? Object.keys(file) : [],
      path: file && file.path
    });
    return { ok: false, status: 500, error: ERR_NO_URL };
  }

  try {
    const updated = await Model.findByIdAndUpdate(recordId, { pdf_url }, { new: true });
    if (!updated) {
      return { ok: false, status: 404, error: notFoundError };
    }
    return { ok: true, pdf_url };
  } catch (e) {
    console.error('Error al actualizar PDF en BD:', e.message);
    return { ok: false, status: 500, error: '❌ Error interno al guardar el PDF.' };
  }
}

module.exports = { attachPdfToRecord };
