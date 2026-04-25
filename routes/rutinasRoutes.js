const express = require('express');
const router = express.Router();

const { getRutinas, addRutina, updateRutina, deleteRutina } = require('../controllers/rutinasController');

router.get('/', getRutinas);
router.post('/', addRutina);
router.put('/:id', updateRutina);
router.delete('/:id', deleteRutina);

module.exports = router;
