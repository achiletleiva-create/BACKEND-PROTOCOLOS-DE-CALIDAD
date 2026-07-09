const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');
const authRouter = require('./routes/auth.routes');

const protocolosRouter = require('./routes/protocolos.routes');
const estanquidadRouter = require('./routes/estanquidad.routes');
const buzonRouter = require('./routes/buzon.routes');
const excavacionRouter = require('./routes/excavacion.routes');
const tuberiaRouter = require('./routes/tuberia.routes');
const pruebaHidraulicaRouter = require('./routes/pruebaHidraulica.routes');
const rellenoRouter = require('./routes/relleno.routes');
const veredaRouter = require('./routes/vereda.routes');
const conexionRouter = require('./routes/conexion.routes');
const conexionTramoRouter = require('./routes/conexionTramo.routes');
const dashboardRouter = require('./routes/dashboard.routes');

const app = express();

// Confiar en el proxy de Render para express-rate-limit
app.set('trust proxy', 1);

// ===== SEGURIDAD: Cabeceras HTTP recomendadas =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://backend-protocolos-de-calidad.onrender.com']
    }
  }
}));

// ===== SEGURIDAD: Rate limiting en login (máx. 10 intentos / 15 min por IP) =====
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de inicio de sesión. Inténtalo de nuevo en 15 minutos.' }
});

const allowedOrigins = [
  'https://achiletleiva-create.github.io',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS: origen no permitido'));
  }
}));
app.use(express.json({ limit: '1mb' }));

// Rutas públicas
app.get('/api/auth/ping', (req, res) => res.json({ ok: true }));
app.use('/api/auth/login', loginLimiter); // Rate limit solo en login
app.use('/api/auth', authRouter);

// Rutas protegidas
app.use('/api/protocolos', authMiddleware, protocolosRouter);
app.use('/api/estanquidad', authMiddleware, estanquidadRouter);
app.use('/api/buzones', authMiddleware, buzonRouter);
app.use('/api/excavacion', authMiddleware, excavacionRouter);
app.use('/api/tuberia', authMiddleware, tuberiaRouter);
app.use('/api/prueba-hidraulica', authMiddleware, pruebaHidraulicaRouter);
app.use('/api/relleno', authMiddleware, rellenoRouter);
app.use('/api/vereda', authMiddleware, veredaRouter);
app.use('/api/conexion', authMiddleware, conexionRouter);
app.use('/api/conexion-tramo', authMiddleware, conexionTramoRouter);
app.use('/api/dashboard', authMiddleware, dashboardRouter);

app.use(errorHandler);

module.exports = app;
