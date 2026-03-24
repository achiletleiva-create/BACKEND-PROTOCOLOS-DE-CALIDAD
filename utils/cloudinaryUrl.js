/** URL pública HTTPS devuelta por Cloudinary (multer-storage-cloudinary usa `path`). */
function extractCloudinaryFileUrl(file) {
  if (!file) return null;
  const raw = file.path || file.secure_url || file.url;
  if (raw == null || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || !/^https?:\/\//i.test(trimmed)) return null;
  return trimmed;
}

module.exports = { extractCloudinaryFileUrl };
