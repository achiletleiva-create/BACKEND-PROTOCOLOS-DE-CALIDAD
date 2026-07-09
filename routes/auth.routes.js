const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });

    const usuario = await Usuario.findOne({ username: username.trim().toLowerCase() });
    if (!usuario)
      return res.status(401).json({ error: 'Credenciales incorrectas.' });

    const valido = await usuario.verificarPassword(password);
    if (!valido)
      return res.status(401).json({ error: 'Credenciales incorrectas.' });

    const token = jwt.sign(
      { id: usuario._id, username: usuario.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, username: usuario.username });
  } catch (e) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Crear usuario inicial — SOLO disponible si ALLOW_SETUP=true en variables de entorno.
// Eliminar o establecer ALLOW_SETUP=false en producción una vez creado el primer usuario.
router.post('/setup', async (req, res) => {
  if (process.env.ALLOW_SETUP !== 'true') {
    return res.status(404).json({ error: 'Ruta no disponible.' });
  }

  try {
    const count = await Usuario.countDocuments();
    if (count > 0)
      return res.status(403).json({ error: 'Ya existe un usuario registrado.' });

    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });

    // Validar longitud mínima de contraseña
    if (password.length < 8)
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });

    const nuevo = new Usuario({ username: username.trim().toLowerCase(), password });
    await nuevo.save();
    res.status(201).json({ mensaje: '✅ Usuario creado correctamente.' });
  } catch (e) {
    console.error('[SETUP] Error al crear usuario:', e);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
