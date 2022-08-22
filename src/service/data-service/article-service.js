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

  async findAll(withComments) {
    const include = [Aliases.CATEGORIES];

    if (withComments) {
      include.push(Aliases.COMMENTS);
    }

    let articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    articles = articles.map((item) => item.get());

    if (withComments) {
      articles = articles.filter((article) => article.comments.length > 0);
    }

    return articles;
  }

  findOne(id, withComments, needCategories) {
    const include = [];

    if (withComments) {
      include.push(Aliases.COMMENTS);
    }

    if (needCategories) {
      include.push(Aliases.CATEGORIES);
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

  async findPage({limit, offset, withComments}) {
    const include = [Aliases.CATEGORIES];

    if (withComments) {
      include.push(Aliases.COMMENTS);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true,
    });

    return {count, articles: rows};
  }
}

module.exports = ArticleService;
