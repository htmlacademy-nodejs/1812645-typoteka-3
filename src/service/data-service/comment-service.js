'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, newComment) {
    return this._Comment.create({
      articleId,
      userId: newComment.userId,
      data: new Date(Date.now()),
      text: newComment.text
    });
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findOne(articleId, commentId) {
    return await this._Comment.findOne({
      where: {
        id: commentId,
        articleId,
      }
    });
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CommentService;
