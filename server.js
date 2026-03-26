<<<<<<< HEAD
require('dotenv').config();
require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
=======
require('dotenv').config();
require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
>>>>>>> f797d30 (Add all project files: app, config, middleware, models, routes, services, utils + .gitignore)
