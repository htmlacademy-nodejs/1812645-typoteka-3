'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    const article = await this._Article.findByPk(articleId);

    return this._Comment.create({
      articleId,
      userId: article.userId,
      data: new Date(Date.now()),
      ...comment
    });
  }

  async findAll(articleId) {
    return  await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findOne(commentId) {
    return await this._Comment.findByPk(commentId);
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CommentService;
