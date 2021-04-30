const models = require('../models')

const userController = {}

userController.create = async (req, res) => {
    try {
        const user = await models.user.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        res.json({ user })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

userController.getAll = async (req, res) => {
    try {
        const users = await models.user.findAll()
        res.json({ users })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

userController.login = async (req, res) => {
    try {
        const user = await models.user.findOne({
            where: {
                email: req.body.email
            }
        })

        if (user.password === req.body.password) {
            res.json({ user })
        }
        else {
            res.status(404).json({ message: 'user not found.' })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


userController.verify = async (req, res) => {
    const userId = req.headers.authorization

    if (userId) {
        try {
            const user = await models.user.findOne({
                where: {
                    id: userId
                }
            })
            res.json({
                user
            })
        } catch (error) {
            res.status(404).json({ message: 'user not found.' })
        }
    }
    else {
        res.status(400).json({ message: 'user not found.' })
    }
}
module.exports = userController