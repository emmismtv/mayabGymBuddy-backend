const mongoose = require('mongoose')

const rutinaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor teclea el nombre de la rutina']
    },
    descripcion: {
        type: String,
        required: [true, 'Por favor teclea una descripción de la rutina']
    },
    grupoMuscular: {
        type: String,
        required: [true, 'Por favor teclea el grupo muscular (ej. Pecho, Espalda, Pierna)']
    },
    nivel: {
        type: String,
        required: [true, 'Por favor teclea el nivel (Principiante, Intermedio, Avanzado)']
    },
    repeticiones: {
        type: String,
        required: [true, 'Por favor teclea el número de repeticiones']
    },
    series: {
        type: String,
        required: [true, 'Por favor teclea el número de series']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Rutina', rutinaSchema)
