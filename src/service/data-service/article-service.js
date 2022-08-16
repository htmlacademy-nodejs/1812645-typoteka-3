'use strict';

const Aliases = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);

    return article.get();
  }

  async findAll(needComments) {
    const include = [Aliases.CATEGORIES];

    if (needComments) {
      include.push(Aliases.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((item) => item.get());
  }

  findOne(id, needComments) {
    const include = [Aliases.CATEGORIES];

    if (needComments) {
      include.push(Aliases.COMMENTS);
    }

    return this._Article.findByPk(id, {include});
  }

  async update(id, newArticle) {
    const [affectedRows] = await this._Article.update(newArticle, {
      where: {id}
    });

    return !!affectedRows;
  }

  async delete(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = ArticleService;
