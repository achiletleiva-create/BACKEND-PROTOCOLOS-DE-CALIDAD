<<<<<<< HEAD
function errorHandler(err, req, res, next) {
  if (!err) return next();
  console.error('Error middleware:', err.message || err);
  const status = err.http_code || err.statusCode || err.status || 500;
  const nested =
    err.error && typeof err.error === 'object' && err.error.message ? err.error.message : null;
  const msg =
    err.message ||
    nested ||
    (typeof err.error === 'string' ? err.error : null) ||
    'Error en la subida del archivo';
  if (res.headersSent) return;
  const code = typeof status === 'number' && status >= 400 && status < 600 ? status : 500;
  res.status(code).json({ error: msg });
}

module.exports = errorHandler;
=======
function errorHandler(err, req, res, next) {
  if (!err) return next();
  console.error('Error middleware:', err.message || err);
  const status = err.http_code || err.statusCode || err.status || 500;
  const nested =
    err.error && typeof err.error === 'object' && err.error.message ? err.error.message : null;
  const msg =
    err.message ||
    nested ||
    (typeof err.error === 'string' ? err.error : null) ||
    'Error en la subida del archivo';
  if (res.headersSent) return;
  const code = typeof status === 'number' && status >= 400 && status < 600 ? status : 500;
  res.status(code).json({ error: msg });
}

module.exports = errorHandler;
>>>>>>> f797d30 (Add all project files: app, config, middleware, models, routes, services, utils + .gitignore)

