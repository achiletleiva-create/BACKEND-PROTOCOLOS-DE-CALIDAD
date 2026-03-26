const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Rutas existentes
const protocolosRouter = require('./routes/protocolos.routes');
const estanquidadRouter = require('./routes/estanquidad.routes');

// Nuevas rutas
const buzonRouter = require('./routes/buzon.routes');
const excavacionRouter = require('./routes/excavacion.routes');
const tuberiaRouter = require('./routes/tuberia.routes');
const pruebaHidraulicaRouter = require('./routes/pruebaHidraulica.routes');
const rellenoRouter = require('./routes/relleno.routes');
const veredaRouter = require('./routes/vereda.routes');
const conexionRouter = require('./routes/conexion.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas existentes
app.use('/api/protocolos', protocolosRouter);
app.use('/api/estanquidad', estanquidadRouter);

// Nuevas rutas
app.use('/api/buzones', buzonRouter);
app.use('/api/excavacion', excavacionRouter);
app.use('/api/tuberia', tuberiaRouter);
app.use('/api/prueba-hidraulica', pruebaHidraulicaRouter);
app.use('/api/relleno', rellenoRouter);
app.use('/api/vereda', veredaRouter);
app.use('/api/conexion', conexionRouter);

app.use(errorHandler);

module.exports = app;
