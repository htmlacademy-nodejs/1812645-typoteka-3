'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (articleService, commentService) => async (req, res, next) => {
  const {articleId, commentId} = req.params;

  const article = await articleService.findOne(articleId);
  if (!article) {
    return res.status(HttpCode.NOT_FOUND).send(`Article with id: ${articleId} not found!!`);
  }

  const comment = await commentService.findOne(commentId);
  if (!comment) {
    return res.status(HttpCode.NOT_FOUND).send(`Comment with id: ${commentId} for article with id: ${articleId} not found!!`);
  }
  res.locals.commentId = commentId;

  return next();
};
