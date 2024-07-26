const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db.config');

exports.register = async (req, res) => {
    try {
        const { EMAIL, PASSWORD, ROLE } = req.body;
        const user = await User.create({ EMAIL, PASSWORD, ROLE });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { EMAIL, PASSWORD_HASH } = req.body;

        const user = await sequelize.query(
            'select * from usuario u where u.EMAIL = :EMAIL',
            {
                replacements: { EMAIL: EMAIL },
                type: sequelize.QueryTypes.SELECT
            }
        );

        const password = await sequelize.query(
            'select * from usuario u where u.PASSWORD_HASH = :PASSWORD_HASH',
            {
                replacements: { PASSWORD_HASH: PASSWORD_HASH },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (user.length === 0) {
            return res.status(201).json({ message: 'Email incorrecto, digite correctamente' });
        }

        if (password.length === 0) {
            return res.status(201).json({ message: 'password incorrecto, digite correctamente' });
        }

        const token = jwt.sign({ id: user[0].ID, role: user[0].ROLE, name:user[0].NOMBRE }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: error.message });
    }
};

