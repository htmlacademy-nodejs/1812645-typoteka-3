'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExists = require(`../middlewares/article-exists`);
const commentExists = require(`../middlewares/comment-exits`);

const router = new Router();

module.exports = (app, articleService) => {
  app.use(`/articles`, router);

  router.post(`/`, articleValidator, async (req, res) => {
    const {newArticle} = res.locals;

    const article = await articleService.createArticle(newArticle);

    return res.status(HttpCode.CREATED).json(article);
  });

  router.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();

    res.status(HttpCode.OK).json(articles);
  });

  router.get(`/:articleId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  router.put(`/:articleId`,
      [articleExists(articleService), articleValidator],
      (req, res) => {
        const {articleId} = req.params;
        const newArticle = req.body;

        const article = articleService.update(articleId, newArticle);

        return res.status(HttpCode.OK).json(article);
      });

  router.delete(`/:articleId`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;

    const delArticle = await articleService.delete(article.id);

    return res.status(HttpCode.OK).json(delArticle);
  });

  router.get(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).send(article.comments);
  });

  router.post(`/:articleId/comments`,
      [articleExists(articleService), commentValidator],
      async (req, res) => {
        const newComment = req.body;
        const {articleId} = req.params;

        const comment = articleService.createComment(articleId, newComment);

        return res.status(HttpCode.CREATED).json(comment);
      }
  );

  router.delete(`/:articleId/comments/:commentId`, commentExists(articleService), async (req, res) => {
    const {article, commentId} = res.locals;

    const delComment = articleService.deleteComment(article, commentId);

    return res.status(HttpCode.OK).json(delComment);
  });
};
