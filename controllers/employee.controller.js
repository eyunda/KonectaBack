const Empleado = require('../models/employee.model');
const sequelize = require('../config/db.config');
const User = require('../models/user.model');

exports.getEmployees = async (req, res) => {
    try {
        const employeesResult = await sequelize.query(
            'SELECT ' +
            '    ROW_NUMBER() OVER (ORDER BY e.ID) AS ID, ' + 
            '    e.ID AS IDE, ' + 
            '    U.ID AS IDU, ' + 
            '    e.FECHA_INGRESO, ' + 
            '    e.NOMBRE, ' + 
            '    e.SALARIO, ' + 
            '    u.EMAIL, ' + 
            '    u.PASSWORD_HASH, ' + 
            '    u.ROLE, ' + 
            '    u.CREATED_AT, ' + 
            '    u.UPDATED_AT ' + 
            'FROM ' + 
            '    Empleado e ' + 
            'JOIN ' + 
            '    Usuario u ON e.NOMBRE = u.NOMBRE ', 
            {
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({empleado: employeesResult});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const empleado = await sequelize.query(
            'SELECT e.ID AS IDE, u.ID AS IDU, e.FECHA_INGRESO, e.NOMBRE, e.SALARIO, u.EMAIL, u.PASSWORD_HASH, u.ROLE, u.CREATED_AT, u.UPDATED_AT ' +
            'FROM Empleado e ' +
            'JOIN Usuario u ON e.NOMBRE = u.NOMBRE ' +
            'WHERE e.ID = :id',
            {
                replacements: { id: id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!empleado.length) {
            return res.status(201).json({ message: 'Empleado no encontrado' });
        }

        res.status(200).json(empleado[0]);
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.createEmployeeAndUser = async (req, res) => {
    const { FECHA_INGRESO, NOMBRE, SALARIO, EMAIL, PASSWORD_HASH, ROLE } = req.body;

    const t = await sequelize.transaction();

    try {

        const empleado = await Empleado.create({
            FECHA_INGRESO,
            NOMBRE,
            SALARIO
        }, { transaction: t });

        const usuario = await User.create({
            NOMBRE,
            EMAIL,
            PASSWORD_HASH,
            ROLE
        }, { transaction: t });

        await t.commit();

        res.status(201).json({
            message: 'Empleado y usuario creados exitosamente',
            empleado,
            usuario
        });
    } catch (error) {
        await t.rollback();
        console.error('Error en la creación:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const {IDE, IDU, FECHA_INGRESO, NOMBRE, SALARIO, EMAIL, PASSWORD_HASH, ROLE } = req.body;

    const t = await sequelize.transaction();

    try {
        const empleado = await Empleado.findByPk(IDE, { transaction: t });

        if (!empleado) {
            await t.rollback();
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        await empleado.update({
            FECHA_INGRESO,
            NOMBRE,
            SALARIO: parseFloat(SALARIO).toFixed(2)
        }, { transaction: t });

        const usuario = await User.findOne({ where: { NOMBRE: empleado.NOMBRE }, transaction: t });

        if (!usuario) {
            await t.rollback();
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.update({
            EMAIL,
            PASSWORD_HASH,
            ROLE
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            message: 'Empleado y usuario actualizados exitosamente',
            empleado,
            usuario
        });
    } catch (error) {
        await t.rollback();
        console.error('Error en la actualización:', error);
        res.status(500).json({ message: error.message });
    }
};


exports.deleteEmployeeAndUser = async (req, res) => {
    const { ide, idu } = req.params;

    const t = await sequelize.transaction();

    try {
        await Empleado.destroy({ where: { ID: ide }, transaction: t });
        await User.destroy({ where: { ID: idu }, transaction: t });

        await t.commit();

        res.status(200).json({ message: 'Empleado y usuario eliminados exitosamente' });
    } catch (error) {
        await t.rollback();
        console.error('Error en la eliminación:', error);
        res.status(500).json({ message: error.message });
    }
};