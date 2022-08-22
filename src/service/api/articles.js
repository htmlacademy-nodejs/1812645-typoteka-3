'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExists = require(`../middlewares/article-exists`);
const commentExists = require(`../middlewares/comment-exits`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

const router = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, router);

  router.post(`/`, articleValidator, async (req, res) => {
    const {newArticle} = res.locals;

    const article = await articleService.create(newArticle);

    return res.status(HttpCode.CREATED).json(article);
  });

  router.get(`/`, async (req, res) => {
    const {offset, limit, withComments} = req.query;
    let result;

    if (limit || offset) {
      result = await articleService.findPage({limit, offset, withComments});
    } else {
      result = await articleService.findAll({withComments});
    }

    res.status(HttpCode.OK).json(result);
  });

  router.get(`/:articleId`, articleExists(articleService), async (req, res) => {
    const {articleId} = req.params;

    const article = await articleService.findOne(articleId, true, true);

    return res.status(HttpCode.OK).json(article);
  });

  router.put(`/:articleId`, [routeParamsValidator, articleExists(articleService), articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const newArticle = req.body;

    const article = await articleService.update(articleId, newArticle);

    return res.status(HttpCode.OK).json(article);
  });

  router.delete(`/:articleId`, [routeParamsValidator, articleExists(articleService)], async (req, res) => {
    const {article} = res.locals;

    const delArticle = await articleService.delete(article.id);

    return res.status(HttpCode.OK).json(delArticle);
  });

  router.get(`/:articleId/comments`, [routeParamsValidator, articleExists(articleService)], async (req, res) => {
    const {articleId} = req.params;

    const comments = await commentService.findAll(articleId);

    return res.status(HttpCode.OK).json(comments);
  });

  router.post(`/:articleId/comments`, [routeParamsValidator, articleExists(articleService), commentValidator], async (req, res) => {
    const newComment = req.body;
    const {articleId} = req.params;

    const comment = await commentService.create(articleId, newComment);

    return res.status(HttpCode.CREATED).json(comment);
  });

  router.delete(`/:articleId/comments/:commentId`, commentExists(articleService, commentService), async (req, res) => {
    const {commentId} = res.locals;

    const delComment = await commentService.delete(commentId);

    return res.status(HttpCode.OK).json(delComment);
  });
};
