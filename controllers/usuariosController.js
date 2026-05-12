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

    if (!user.esAdmin) {
        res.status(401);
        throw new Error('No tienes autorizado acceder a esta página.');
    }

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
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
    if (!req.body.nombre || !req.body.apellido || !req.body.email || !req.body.telefono || !req.body.tipo) {
        res.status(400);
        throw new Error('Por favor teclea todos los campos básicos.');
    }

    if (req.body.esAdmin && !req.body.password) {
        res.status(400);
        throw new Error('Por favor proporciona una contraseña para el administrador.');
    }

    const usuarioExistente = await Usuario.findOne({ email: req.body.email });
    if (usuarioExistente) {
        res.status(400);
        throw new Error('El usuario ya existe con ese correo');
    }

    let hashedPassword = undefined;
    if (req.body.esAdmin && req.body.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        tipo: req.body.tipo,
        password: hashedPassword,
        esAdmin: req.body.esAdmin || false
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
    
    if (!req.body.password) {
        delete updateData.password;
    }
    
    // Si lo hacen admin y envian password, hashearlo
    if (req.body.esAdmin && req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(req.body.password, salt);
    }
    // updateData.esAdmin ya tendrá "false" así que se actualizará.

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
