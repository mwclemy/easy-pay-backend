const e = require('express')
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

        if (user) {
            if (user.password === req.body.password) {
                res.json({ user })
            }
            else {
                res.status(404).json({ message: 'user not found.' })
            }
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

userController.addCash = async (req, res) => {
    try {
        const userId = req.headers.authorization
        if (userId) {
            const user = await models.user.findOne({
                where: {
                    id: userId
                }
            })
            const updatedBalance = parseFloat(user.balance) + req.body.amount
            await models.user.update({
                balance: updatedBalance
            }, {
                where: {
                    id: user.id
                }
            })

            await user.reload()
            res.json({ user })
        }
        else {
            res.status(400).json({ message: 'user not found.' })
        }
    } catch (error) {
        res.json({ message: error.message })
    }

}

userController.sendCash = async (req, res) => {
    try {

        const senderId = req.headers.authorization
        if (senderId) {
            const amount = req.body.amount
            const reason = req.body.reason
            const receiverEmails = req.body.receiver

            const numReceivers = receiverEmails.length

            const sender = await models.user.findOne({
                where: {
                    id: senderId
                }
            })
            if (sender.balance >= numReceivers * amount) {
                const result = await models.sequelize.transaction(async (t) => {
                    for (let receiverEmail of receiverEmails) {
                        const receiver = await models.user.findOne({
                            where: {
                                email: receiverEmail
                            },
                            transaction: t
                        })

                        await models.user.addAmountToReceiver({
                            receiver: receiver,
                            amount: amount
                        }, { transaction: t })

                        await models.user.withDrawAmountFromSender({
                            sender: sender,
                            amount: amount
                        }, { transaction: t })

                        await models.transaction.recordTransaction({
                            sender: sender,
                            receiver: receiver,
                            amount: amount,
                            reason: reason
                        }, { transaction: t })
                    }

                })
                console.log(result);
                res.json({ message: 'ok' })
            }
            else {
                res.status(400).json({ message: 'Insufficient fund.' })
            }
        }
        else {
            res.status(400).json({ message: 'user not found.' })
        }

    } catch (error) {
        res.json({ message: error.message })
    }

}
module.exports = userController