require('dotenv').config();
require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
