'use strict';

const {Router} = require(`express`);
const auth = require(`../middlewares/auth`);

const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);
const {prepareErrorsToArray} = require(`../../utils/utils`);

const adminRouter = new Router();

// мои публикации
adminRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;

  const articles = await api.getArticles({userId: user.id});

  res.render(`admin/admin-articles`, {articles});
});

adminRouter.delete(`/:id`, auth, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const article = await api.deleteArticle({id, userId: user.id});

    res.status(HttpCode.OK).send(article);
  } catch (errors) {

    res.status(errors.response.status).send(errors.response.statusText);
  }
});

// комментарии к публикациям
adminRouter.get(`/comments`, auth, async (req, res) => {
  const comments = await api.getComments();

  res.render(`admin/admin-comments`, {comments});
});

adminRouter.delete(`/:articleId/comments/:commentId`, auth, async (req, res) => {
  const {articleId, commentId} = req.params;

  try {
    const result = await api.deleteComments(articleId, commentId);

    res.status(HttpCode.OK).send(result);
  } catch (error) {

    res.status(HttpCode.BAD_REQUEST).send(error.response.statusText);
  }
});

// категории
adminRouter.get(`/categories`, auth, async (req, res) => {
  const categories = await api.getCategories();

  res.render(`admin/admin-categories`, {categories});
});

// создание категории
adminRouter.post(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
  const {addCategoryName} = req.body;

  const newCategory = {name: addCategoryName};

  try {
    await api.createCategory(newCategory);
    const categories = await api.getCategories();

    res.render(`admin/admin-categories`, {categories});
  } catch (error) {
    const validationMessages = prepareErrorsToArray(error);
    const categories = await api.getCategories();

    res.render(`admin/admin-categories`, {user, categories, validationMessages});
  }
});

// редактирование категории
adminRouter.post(`/categories/:id`, auth, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {editCategoryName} = req.body;

  const editCategoryObject = {name: editCategoryName};

  try {
    await api.editCategory(id, editCategoryObject);
    const categories = await api.getCategories();

    res.render(`admin/admin-categories`, {categories});
  } catch (error) {
    const validationMessages = prepareErrorsToArray(error);
    const categories = await api.getCategories();

    res.render(`admin/admin-categories`, {user, categories, validationMessages});
  }
});

// удаление категории
adminRouter.delete(`/categories/:id`, auth, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const result = await api.deleteCategory({id, userId: user.id});

    res.status(HttpCode.OK).send(result);
  } catch (error) {

    res.status(HttpCode.BAD_REQUEST).send(error.response.statusText);
  }
});

module.exports = adminRouter;
