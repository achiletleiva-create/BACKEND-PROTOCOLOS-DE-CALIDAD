const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Protocolos_Victor_Larco',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ angle: 'exif' }, { width: 1200, crop: 'limit' }]
  }
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'Protocolos_Victor_Larco/PDFs',
    resource_type: 'raw',
    public_id: `pdf_${String(req.params.id)}_${Date.now()}`,
    format: 'pdf'
  })
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Solo se permiten imágenes JPG y PNG'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadPdf = multer({ storage: pdfStorage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { upload, uploadPdf };
