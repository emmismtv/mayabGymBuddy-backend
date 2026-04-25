const express = require('express');
const router = express.Router();

const { getUsuarios, addUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuariosController');

router.get('/', getUsuarios);
router.post('/', addUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

module.exports = router;
