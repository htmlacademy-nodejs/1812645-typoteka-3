'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryValidator = require(`../middlewares/category-validator`);

const router = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, router);

  router.post(`/`, categoryValidator, async (req, res) => {
    const {newCategory} = res.locals;

    const category = await categoryService.create(newCategory);

    return res.status(HttpCode.CREATED).json(category);
  });

  router.get(`/`, async (req, res) => {
    const {count} = req.query;

    const categories = await categoryService.findAll(count);

    res.status(HttpCode.OK).json(categories);
  });

  router.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;

    const category = await categoryService.findOne(categoryId);

    res.status(HttpCode.OK).json(category);
  });

  router.put(`/:categoryId`, categoryValidator, async (req, res) => {
    const {categoryId} = req.params;
    const {newCategory} = res.locals;

    const category = await categoryService.update(categoryId, newCategory);

    return res.status(HttpCode.OK).json(category);
  });

  router.delete(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;

    const categories = await categoryService.findAll(true);

    const categoryArticlesCount = categories.find((item) => item.id === +categoryId).count;

    if (+categoryArticlesCount) {
      return res.status(HttpCode.BAD_REQUEST).send(false);
    } else {
      const delCategory = await categoryService.delete(categoryId);

      return res.status(HttpCode.OK).json(delCategory);
    }
  });
};
