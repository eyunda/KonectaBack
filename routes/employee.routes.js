const express = require('express');
const { getEmployees, createEmployeeAndUser, updateEmployee, deleteEmployeeAndUser, getEmployeeById} = require('../controllers/employee.controller');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/', authenticateToken, getEmployees);
router.get('/:id', authenticateToken, getEmployeeById);
router.post('/', authenticateToken, createEmployeeAndUser);
router.put('/:id', authenticateToken, updateEmployee);
router.delete('/:ide/:idu', authenticateToken, deleteEmployeeAndUser);


module.exports = router;
