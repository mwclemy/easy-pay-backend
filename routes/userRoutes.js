const express = require('express')
const userController = require('../controllers/userController')

const userRoutes = express.Router()

userRoutes.post('/', userController.create)
userRoutes.get('/', userController.getAll)
userRoutes.post('/login', userController.login)
userRoutes.get('/verify', userController.verify)

module.exports = userRoutes