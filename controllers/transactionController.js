const models = require('../models')
const { Op } = require("sequelize")
const user = require('../models/user')
const transactionController = {}

transactionController.getUserTransactions = async (req, res) => {
    const userId = parseInt(req.headers.authorization)

    if (userId) {
        try {
            const transactions = await models.transaction.findAll({
                where: {
                    [Op.or]: [
                        {
                            senderId: {
                                [Op.eq]: userId
                            }
                        },
                        {
                            receiverId: {
                                [Op.eq]: userId
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: models.user,
                        as: 'sender'
                    },
                    {
                        model: models.user,
                        as: 'receiver'
                    }]
            })

            res.json({ transactions })
        } catch (error) {
            console.log(error);
            res.json({ message: error.message })
        }
    }

    else {
        res.json({ message: 'user not found.' })
    }

}

module.exports = transactionController