const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Empleado = sequelize.define('Empleado', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'ID'
    },
    FECHA_INGRESO: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'FECHA_INGRESO' 
    },
    NOMBRE: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'NOMBRE' 
    },
    SALARIO: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        field: 'SALARIO' 
    },
    CREATED_AT: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'CREATED_AT',
    },
    UPDATED_AT: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        field: 'UPDATED_AT',
    },
}, {
    timestamps: false,
    tableName: 'Empleado',
});

module.exports = Empleado;
