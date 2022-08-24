'use strict';

const {HttpCode} = require(`../const/constants`);

module.exports = (service) => (req, res, next) => {
  const {articleId, commentId} = req.params;

  const article = service.findOne(articleId);
  if (!article) {
    return res.status(HttpCode.NOT_FOUND).send(`Article with id: ${articleId} not found!!`);
  }

  const comment = article.comments.find((com) => com.id === commentId);
  if (!comment) {
    return res.status(HttpCode.NOT_FOUND).send(`Comment with id: ${commentId} for article with id: ${articleId} not found!!`);
  }

  res.locals.article = article;
  res.locals.commentId = commentId;

  return next();
};
