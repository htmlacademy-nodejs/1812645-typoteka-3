'use strict';

const {DataTypes, Model} = require(`sequelize`);

const {MAX_NUMBER_OF_COMMENTS} = require(`../../constants`);

class Comment extends Model {}

const define = (sequelize) => Comment.init({
  text: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(MAX_NUMBER_OF_COMMENTS),
    allowNull: false
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

module.exports = define;
