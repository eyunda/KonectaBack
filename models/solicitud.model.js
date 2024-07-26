const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Solicitud = sequelize.define('solicitud', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'ID'
    },
    CODIGO: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'CODIGO'
    },
    DESCRIPCION: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'DESCRIPCION'
    },
    RESUMEN: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'RESUMEN'
    },
    ID_EMPLEADO: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ID_EMPLEADO'
    },
    CREATED_AT: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'CREATED_AT'
    },
    UPDATED_AT: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        field: 'UPDATED_AT'
    },
}, {
    timestamps: false,
    tableName: 'solicitud',
});

module.exports = Solicitud;
