const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { getUsuarios, loginUsuario, addUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuariosController');

router.get('/', getUsuarios);
router.post('/login', loginUsuario);
router.post('/', protect, addUsuario);
router.put('/:id', protect, updateUsuario);
router.delete('/:id', protect, deleteUsuario);

module.exports = router;
