const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Protocolos_Victor_Larco',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'Protocolos_Victor_Larco/PDFs',
    resource_type: 'image',
    public_id: `pdf_${String(req.params.id)}_${Date.now()}`,
    type: 'upload',
    format: 'pdf'
  })
});

const upload = multer({ storage });
const uploadPdf = multer({ storage: pdfStorage });

module.exports = { upload, uploadPdf };
