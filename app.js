const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const protocolosRouter = require('./routes/protocolos.routes');
const estanquidadRouter = require('./routes/estanquidad.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/protocolos', protocolosRouter);
app.use('/api/estanquidad', estanquidadRouter);

app.use(errorHandler);

module.exports = app;
