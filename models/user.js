'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.transaction, { foreignKey: 'senderId' })
      models.user.hasMany(models.transaction, { foreignKey: 'receiverId' })
    }
  };
  user.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.addAmountToReceiver = async ({ receiver, amount }) => {
    await user.update({
      balance: parseFloat(receiver.balance) + amount
    }, {
      where: {
        id: receiver.id
      }
    })
  };

  user.withDrawAmountFromSender = async ({ sender, amount }) => {
    await user.update({
      balance: parseFloat(sender.balance) - amount
    }, {
      where: {
        id: sender.id
      }
    })
  };

  return user;
};