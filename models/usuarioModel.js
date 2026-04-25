const mongoose = require('mongoose')

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor teclea tu nombre']
    },
    apellido: {
        type: String,
        required: [true, 'Por favor teclea tu apellido']
    },
    email: {
        type: String,
        required: [true, 'Por favor teclea el correo electrónico'],
        unique: true,
        match: [/@/, 'El correo debe incluir un @']
    },
    telefono: {
        type: Number,
        required: [true, 'Por favor teclea tu número de teléfono'],
        unique: true,
        validate: {
            validator: function(v) {
                return v.toString().length <= 10;
            },
            message: 'El teléfono no debe tener más de 10 dígitos'
        }
    },
    tipo: {
        type: String,
        required: [true, 'Por favor teclea el tipo de usuario (Estudiante, Coach, Egresado)']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Usuario', usuarioSchema)
