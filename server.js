const express = require('express')

const userRoutes = require('./routes/userRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const app = express()
const port = 3001

app.use(express.json())
app.use(require('cors')())
const routesReport = require('rowdy-logger').begin(app)

app.use('/users', userRoutes)
app.use('/transactions', transactionRoutes)
app.listen(port, () => {
    console.log(`listening on port ${port}`);
    routesReport.print()
})