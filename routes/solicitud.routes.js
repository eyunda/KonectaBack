const express = require('express');
const { getSolicitud, createSolicitudAndUser, updateSolicitud, deleteSolicitudAndUser, getSolicitudById} = require('../controllers/solicitud.controller');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/', authenticateToken, getSolicitud);
router.get('/:id', authenticateToken, getSolicitudById);
router.post('/', authenticateToken, createSolicitudAndUser);
router.put('/:id', authenticateToken, updateSolicitud);
router.delete('/:isd', authenticateToken, deleteSolicitudAndUser);


module.exports = router;
