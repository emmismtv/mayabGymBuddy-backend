const asyncHandler = require("express-async-handler")
const Rutina = require("../models/rutinaModel")

const getRutinas = asyncHandler(async (req, res) => {
    const rutinas = await Rutina.find({})
    res.status(200).json(rutinas)
})

const addRutina = asyncHandler(async (req, res) => {
    if (!req.body.nombre || !req.body.descripcion || !req.body.grupoMuscular || !req.body.nivel || !req.body.repeticiones || !req.body.series) {
        res.status(400)
        throw new Error('Por favor teclea todos los campos: Nombre, Descripción, Grupo Muscular, Nivel, Repeticiones, Series')
    }

    const rutina = await Rutina.create({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        grupoMuscular: req.body.grupoMuscular,
        nivel: req.body.nivel,
        repeticiones: req.body.repeticiones,
        series: req.body.series
    })

    if (rutina) {
        res.status(201).json(rutina)
    } else {
        res.status(500)
        throw new Error('Error al crear la rutina')
    }
})

const updateRutina = asyncHandler(async (req, res) => {
    const rutina = await Rutina.findById(req.params.id)

    if (!rutina) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    const updatedRutina = await Rutina.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedRutina)
})

const deleteRutina = asyncHandler(async (req, res) => {
    const rutina = await Rutina.findById(req.params.id)

    if (!rutina) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    } else {
        await Rutina.deleteOne(rutina)
        res.status(200).json({ message: 'Rutina eliminada', id: req.params.id })
    }
})

module.exports = {
    getRutinas,
    addRutina,
    updateRutina,
    deleteRutina
}
