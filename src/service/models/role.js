'use strict';

const {Model, DataTypes} = require(`sequelize`);

class Role extends Model {}

const define = (sequelize) => Role.init({
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Role`,
  tableName: `roles`
});

module.exports = define;
