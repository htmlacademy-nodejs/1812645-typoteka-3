'use strict';

const Aliases = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);

    return article.get();
  }

  async findAll(userId, withComments) {
    const include = [
      Aliases.CATEGORIES,
      {
        model: this._User,
        as: Aliases.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliases.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliases.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
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

  findOne(id, withComments) {
    const include = [
      Aliases.CATEGORIES,
      {
        model: this._User,
        as: Aliases.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliases.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliases.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
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
    const include = [
      Aliases.CATEGORIES,
      {
        model: this._User,
        as: Aliases.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

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

    let articles;
    if (withComments) {
      // articles = rows.filter((article) => article.comments.length > 0);  // временно, отладка
      articles = rows.map((article) => article.get());
    }

    return {count, articles};
  }

  async findPageArticlesByCategory({categoryId, offset, limit}) {
    const articlesIdByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const articlesId = articlesIdByCategory.map((item) => item.ArticleId);

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        Aliases.CATEGORIES,
        Aliases.COMMENTS,
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: articlesId
      },
      distinct: true
    });

    return {count, articles: rows};
  }
}

module.exports = ArticleService;
