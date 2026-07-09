const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI no está definida. El servidor no puede iniciar.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  })
  .then(() => console.log('✅ Conectado a la BD de Ingeniería'))
  .catch((err) => {
    console.error('❌ Error crítico de conexión a la BD:', err);
    process.exit(1);
  });

module.exports = mongoose;
