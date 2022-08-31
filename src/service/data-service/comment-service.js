'use strict';

const Aliases = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleId, newComment) {
    return this._Comment.create({
      articleId,
      userId: newComment.userId,
      data: new Date(Date.now()),
      text: newComment.text
    });
  }

  async findAll() {
    const include = [
      Aliases.USERS
    ];

    let comments = await this._Comment.findAll({
      include,
      order: [
        [`data`, `DESC`]
      ]
    });

    return comments.map((item) => item.get());
  }

  async findAllForArticle(articleId) {
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
