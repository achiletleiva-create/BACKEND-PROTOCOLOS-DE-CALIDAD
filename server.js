const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Protocolo = require('./models/protocolo');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a la BD de Ingeniería"))
  .catch(err => console.error("❌ Error de conexión:", err));

// RUTA: Guardar un nuevo protocolo de vaciado
app.post('/api/protocolos', async (req, res) => {
  try {
    const nuevoProtocolo = new Protocolo(req.body);
    await nuevoProtocolo.save();
    res.status(201).json({ message: "Protocolo de Liberación guardado con éxito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// RUTA: Obtener todos los protocolos (para auditoría)
app.get('/api/protocolos', async (req, res) => {
  const protocolos = await Protocolo.find();
  res.json(protocolos);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
