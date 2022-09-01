'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const routeParamsValidator = require(`../middlewares/route-params-validator`);

const router = new Router();

module.exports = (app, commentService) => {
  app.use(`/comments`, router);

  router.get(`/`, routeParamsValidator, async (req, res) => {
    const comments = await commentService.findAll();

    return res.status(HttpCode.OK).json(comments);
  });
};
