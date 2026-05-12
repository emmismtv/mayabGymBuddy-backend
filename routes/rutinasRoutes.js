const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { getRutinas, addRutina, updateRutina, deleteRutina } = require('../controllers/rutinasController');

router.get('/', getRutinas);
router.post('/', protect, addRutina);
router.put('/:id', protect, updateRutina);
router.delete('/:id', protect, deleteRutina);

module.exports = router;
