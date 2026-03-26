const express = require('express');
const cors = require('cors');
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

const app = express();

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

app.use(errorHandler);

module.exports = app;
