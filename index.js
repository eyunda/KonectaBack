const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const solicitudRoutes = require('./routes/solicitud.routes');
const dotenv = require('dotenv')
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/solicitud', solicitudRoutes);

dotenv.config({path: './.env'})

sequelize.sync().then(() => {
    console.log('Conectado a la base de datos');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Corriendo el servidor en el puerto: ${PORT}`);
});

module.exports = app;
