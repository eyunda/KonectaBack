const Empleado = require('../models/employee.model');
const sequelize = require('../config/db.config');
const User = require('../models/user.model');
const Solicitud = require('../models/solicitud.model');

exports.getSolicitud = async (req, res) => {
    try {
        const employeesResult = await sequelize.query(
            'select ' +
            '    ROW_NUMBER() OVER (ORDER BY s.ID) AS ID, ' + 
            '    s.ID as ISD, ' +
            '    s.CODIGO, ' +
            '    s.DESCRIPCION, ' +
            '    s.RESUMEN, ' +
            '    e.ID as IDE, ' +
            '    e.FECHA_INGRESO, ' +
            '    s.ID_EMPLEADO, ' +
            '    e.NOMBRE, ' +
            '    e.SALARIO, ' +
            '    s.CREATED_AT, ' +
            '    s.UPDATED_AT ' +
            'from solicitud s ' +
            'left join empleado e on s.ID_EMPLEADO = e.ID ', 
            {
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json({solicitudes: employeesResult});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSolicitudById = async (req, res) => {
    const { id } = req.params;

    try {
        const solicitud = await sequelize.query(
            'select ' +
            '    s.ID as ISD, ' +
            '    s.CODIGO, ' +
            '    s.DESCRIPCION, ' +
            '    s.RESUMEN, ' +
            '    e.ID as IDE, ' +
            '    e.FECHA_INGRESO, ' +
            '    e.FECHA_INGRESO, ' +
            '    s.ID_EMPLEADO, ' +
            '    e.NOMBRE, ' +
            '    e.SALARIO, ' +
            '    s.CREATED_AT, ' +
            '    s.UPDATED_AT ' +
            'from solicitud s ' +
            'left join empleado e on s.ID_EMPLEADO = e.ID ' +
            'WHERE s.ID = :id',
            {
                replacements: { id: id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!solicitud.length) {
            return res.status(201).json({ message: 'Solicitud no encontrada' });
        }

        res.status(200).json(solicitud[0]);
    } catch (error) {
        console.error('Error al obtener la solicitud:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.createSolicitudAndUser = async (req, res) => {
    const { CODIGO, DESCRIPCION, ID_EMPLEADO, RESUMEN } = req.body;

    const t = await sequelize.transaction();

    try {
        // Crear empleado
        const solicitud = await Solicitud.create({
            CODIGO,
            DESCRIPCION,
            RESUMEN,
            ID_EMPLEADO
        }, { transaction: t });

        await t.commit();

        res.status(201).json({
            message: 'Solicitud creada exitosamente',
            solicitud
        });
    } catch (error) {
        await t.rollback();
        console.error('Error en la creación:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateSolicitud = async (req, res) => {
    const { id } = req.params;
    const { CODIGO, DESCRIPCION, ID_EMPLEADO, RESUMEN } = req.body;

    const t = await sequelize.transaction();

    try {
        const solicitud = await Solicitud.findByPk(id, { transaction: t });

        if (!solicitud) {
            await t.rollback();
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        await Solicitud.update({
            CODIGO,
            DESCRIPCION,
            RESUMEN,
            ID_EMPLEADO
        }, {
            where: { ID: id },
            transaction: t
        });

        await t.commit();

        res.status(200).json({
            message: 'Solicitud actualizada exitosamente',
            solicitud
        });
    } catch (error) {
        await t.rollback();
        console.error('Error en la actualización:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSolicitudAndUser = async (req, res) => {
    const { isd } = req.params;

    const t = await sequelize.transaction();

    try {
        await Solicitud.destroy({ where: { ID: isd }, transaction: t });

        await t.commit();

        res.status(200).json({ message: 'Solicitud eliminada exitosamente' });
    } catch (error) {
        await t.rollback();
        console.error('Error en la eliminación:', error);
        res.status(500).json({ message: error.message });
    }
};