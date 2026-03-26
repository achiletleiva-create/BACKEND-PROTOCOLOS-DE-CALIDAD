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

// Crear usuario inicial (solo usar una vez, luego deshabilitar)
router.post('/setup', async (req, res) => {
  try {
    const count = await Usuario.countDocuments();
    if (count > 0)
      return res.status(403).json({ error: 'Ya existe un usuario registrado.' });

    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });

    const nuevo = new Usuario({ username: username.trim().toLowerCase(), password });
    await nuevo.save();
    res.status(201).json({ mensaje: '✅ Usuario creado correctamente.' });
  } catch (e) {
    res.status(500).json({ error: 'Error al crear usuario.' });
  }
});

module.exports = router;
