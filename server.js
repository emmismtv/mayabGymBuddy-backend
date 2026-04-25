const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./config/db')
const port = process.env.PORT || 5001
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')

connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors())

app.use('/api/rutinas', require('./routes/rutinasRoutes'))
app.use('/api/usuarios', require('./routes/usuariosRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`.yellow.bold))
