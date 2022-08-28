'use strict';

const {Op} = require(`sequelize`);
const Aliases = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Articles = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  async findAll(searchText) {
    const articles = await this._Articles.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [
        Aliases.CATEGORIES,
        {
          model: this._User,
          as: Aliases.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ]
    });
    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
