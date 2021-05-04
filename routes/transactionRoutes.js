const express = require('express')
const transactionController = require('../controllers/transactionController')

const transactionRoutes = express.Router()

transactionRoutes.get('/userTransactions', transactionController.getUserTransactions)
module.exports = transactionRoutes