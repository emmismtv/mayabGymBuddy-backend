const asyncHandler = require("express-async-handler")
const Usuario = require("../models/usuarioModel")

const getUsuarios = asyncHandler(async (req, res) => {
    const usuarios = await Usuario.find({})
    res.status(200).json(usuarios)
})

const addUsuario = asyncHandler(async (req, res) => {
    if (!req.body.nombre || !req.body.apellido || !req.body.email || !req.body.telefono || !req.body.tipo) {
        res.status(400)
        throw new Error('Por favor teclea todos los campos: Nombre, Apellido, Email, Teléfono, Tipo de Usuario (Estudiante, Coach, Egresado)')
    }

    const usuarioExistente = await Usuario.findOne({ email: req.body.email })
    if (usuarioExistente) {
        res.status(400)
        throw new Error('El usuario ya existe con ese correo')
    }

    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        tipo: req.body.tipo
    })

    if (usuario) {
        res.status(201).json(usuario)
    } else {
        res.status(500)
        throw new Error('Error al crear el usuario')
    }
})

const updateUsuario = asyncHandler(async (req, res) => {
    const usuario = await Usuario.findById(req.params.id)

    if (!usuario) {
        res.status(404)
        throw new Error('Usuario no encontrado')
    }

    const updatedUsuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedUsuario)
})

const deleteUsuario = asyncHandler(async (req, res) => {
    const usuario = await Usuario.findById(req.params.id)

    if (!usuario) {
        res.status(404)
        throw new Error('Usuario no encontrado')
    } else {
        await Usuario.deleteOne(usuario)
        res.status(200).json({ message: 'Usuario eliminado', id: req.params.id })
    }
})

module.exports = {
    getUsuarios,
    addUsuario,
    updateUsuario,
    deleteUsuario
}
