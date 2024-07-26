const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'ID',
    },
    NOMBRE: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'NOMBRE',
    },
    EMAIL: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'EMAIL',
    },
    PASSWORD_HASH: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'PASSWORD_HASH',
    },
    ROLE: {
        type: DataTypes.ENUM('Empleado', 'Administrador'),
        allowNull: false,
        field: 'ROLE',
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
    tableName: 'Usuario',
});

module.exports = User;
