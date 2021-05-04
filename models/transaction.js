'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.transaction.belongsTo(models.user, { foreignKey: 'senderId', as: 'sender' });
      models.transaction.belongsTo(models.user, { foreignKey: 'receiverId', as: 'receiver' });

    }
  };
  transaction.init({
    amount: DataTypes.DECIMAL,
    reason: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction',
  });

  transaction.recordTransaction = async ({ sender, receiver, amount, reason }) => {
    const result = await transaction.create({
      amount: amount,
      reason: reason,
      senderId: sender.id,
      receiverId: receiver.id
    })

    return result
  }
  return transaction;
};