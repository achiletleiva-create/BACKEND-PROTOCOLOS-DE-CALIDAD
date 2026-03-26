const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

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

app.use('/api/protocolos', protocolosRouter);
app.use('/api/estanquidad', estanquidadRouter);
app.use('/api/buzones', buzonRouter);
app.use('/api/excavacion', excavacionRouter);
app.use('/api/tuberia', tuberiaRouter);
app.use('/api/prueba-hidraulica', pruebaHidraulicaRouter);
app.use('/api/relleno', rellenoRouter);
app.use('/api/vereda', veredaRouter);
app.use('/api/conexion', conexionRouter);

app.use(errorHandler);

module.exports = app;
