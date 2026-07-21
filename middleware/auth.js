const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const tokenFromCookie = req.cookies ? req.cookies.token : null;
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch (err) {
    console.warn('[AUTH] JWT verification failed:', err.name, '-', req.ip);
    const msg = err.name === 'TokenExpiredError'
      ? 'Token expirado. Por favor inicia sesión nuevamente.'
      : 'Token inválido.';
    res.status(401).json({ error: msg });
  }
}

module.exports = authMiddleware;
