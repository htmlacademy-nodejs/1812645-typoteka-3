'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();
const {ensureArray, prepareErrors} = require(`../../utils/utils`);

const articlesRouter = new Router();

const csrfProtection = csrf();

const getAddOfferData = () => {
  return api.getCategories({withCount: false});
};

// страница создания новой публикации
articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const categories = await getAddOfferData();
  res.render(`article/article-add`, {categories, csrfToken: req.csrfToken()});
});

// запрос на создание новой публикации
articlesRouter.post(`/add`, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const articleData = {
    picture: file ? file.filename : null,
    title: body.title,
    announce: body.announce,
    fulltext: body.fulltext,
    categories: ensureArray([1, 2]),
    createdAt: body.date ? body.date : new Date(Date.now()),
    userId: user.id,
  };

  try {
    await api.createArticle(articleData);

    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddOfferData();

    res.render(`article/article-add`, {user, articleData, validationMessages, categories});
  }
});

// редактирование публикации
articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  res.render(`article/article-edit`, {id, article, categories, csrfToken: req.csrfToken()});
});

// запрос на редактирование публикации
articlesRouter.post(`/edit/:id`, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    picture: file ? file.filename : null,
    title: body.title,
    announce: body.announce,
    fulltext: body.fulltext,
    categories: ensureArray([1, 2]),
    createdAt: body.date ? body.date : new Date(Date.now()),
    userId: user.id,
  };

  try {
    await api.editArticles({id, data: articleData});

    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);

    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories()
    ]);

    res.render(`article/article-edit`, {user, id, article, categories, validationMessages});
  }
});

// страница публикации
articlesRouter.get(`/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const article = await api.getArticle(id);

  res.render(`article-detail`, {user, article});
});

// создание комментария к публикации
articlesRouter.post(`/:id/comments`, upload.single(`avatar`), async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;

  const newComment = {
    userId: user.id,
    text: message,
  };

  try {
    await api.createComment({id, data: newComment});

    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await api.getArticle(id);

    res.render(`article-detail`, {user, article, validationMessages});
  }
});

// публикации в определённой категории
articlesRouter.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const categories = await api.getCategories(true);

  res.render(`article-by-category`, {id, user, categories});
});

module.exports = articlesRouter;
