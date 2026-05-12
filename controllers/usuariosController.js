const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require("../models/usuarioModel");

const getUsuarios = asyncHandler(async (req, res) => {
    const usuarios = await Usuario.find({});
    res.status(200).json(usuarios);
});

const loginUsuario = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await Usuario.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('Usuario no registrado');
    }

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            esAdmin: user.esAdmin,
            token: generarToken(user.id)
        });
    } else {
        res.status(401);
        throw new Error('Credenciales Incorrectas');
    }
});

const addUsuario = asyncHandler(async (req, res) => {
    if (!req.body.nombre || !req.body.apellido || !req.body.email || !req.body.telefono || !req.body.tipo || !req.body.password || req.body.esAdmin === undefined) {
        res.status(400);
        throw new Error('Por favor teclea todos los campos: Nombre, Apellido, Email, Teléfono, Tipo de Usuario (Estudiante, Coach, Egresado), Password y Selecciona si es admin.');
    }

    const usuarioExistente = await Usuario.findOne({ email: req.body.email });
    if (usuarioExistente) {
        res.status(400);
        throw new Error('El usuario ya existe con ese correo');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        tipo: req.body.tipo,
        password: hashedPassword,
        esAdmin: req.body.esAdmin
    });

    if (usuario) {
        res.status(201).json(usuario);
    } else {
        res.status(500);
        throw new Error('Error al crear el usuario');
    }
});

const updateUsuario = asyncHandler(async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    let updateData = { ...req.body };
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUsuario = await Usuario.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
    });

    res.status(200).json(updatedUsuario);
});

const deleteUsuario = asyncHandler(async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    } else {
        await Usuario.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Usuario eliminado', id: req.params.id });
    }
});

const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = {
    getUsuarios,
    loginUsuario,
    addUsuario,
    updateUsuario,
    deleteUsuario
};
