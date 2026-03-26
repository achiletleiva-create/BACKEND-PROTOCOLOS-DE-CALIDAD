<<<<<<< HEAD
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a la BD de Ingeniería'))
  .catch((err) => console.error('❌ Error de conexión:', err));

module.exports = mongoose;
=======
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a la BD de Ingeniería'))
  .catch((err) => console.error('❌ Error de conexión:', err));

module.exports = mongoose;
>>>>>>> f797d30 (Add all project files: app, config, middleware, models, routes, services, utils + .gitignore)
