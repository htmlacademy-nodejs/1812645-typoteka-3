'use strict';

const {Model, DataTypes} = require(`sequelize`);

class User extends Model {}

const define = (sequelize) => User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  avatar: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
  modelName: `User`,
  tableName: `users`
});

module.exports = define;
