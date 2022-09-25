'use strict';

const {DataTypes, Model} = require(`sequelize`);

const {MAX_NUMBER_OF_COMMENTS} = require(`../../constants`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  announce: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fulltext: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(MAX_NUMBER_OF_COMMENTS),
  },
  picture: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
