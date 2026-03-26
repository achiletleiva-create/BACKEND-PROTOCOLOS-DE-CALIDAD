const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a la BD de Ingeniería'))
  .catch((err) => console.error('❌ Error de conexión:', err));

module.exports = mongoose;
