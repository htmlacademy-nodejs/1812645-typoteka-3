'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ensureArray, prepareErrors} = require(`../../utils/utils`);

const articlesRouter = new Router();

const getAddOfferData = () => {
  return api.getCategories({withCount: false});
};

// страница создания новой публикации
articlesRouter.get(`/add`, async (req, res) => {
  const categories = await getAddOfferData();
  res.render(`article/article-add`, {categories});
});

// запрос на создание новой публикации
articlesRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    picture: file ? file.filename : null,
    title: body.title,
    announce: body.announce,
    fulltext: body.fulltext,
    categories: ensureArray([1, 2]),
    createdAt: body.date ? body.date : new Date(Date.now()),
    userId: 1,
  };

  try {
    await api.createArticle(articleData);

    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddOfferData();

    res.render(`article/article-add`, {articleData, validationMessages, categories});
  }
});

// редактирование публикации
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  res.render(`article/article-edit`, {id, article, categories});
});

// запрос на редактирование публикации
articlesRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    picture: file ? file.filename : null,
    title: body.title,
    announce: body.announce,
    fulltext: body.fulltext,
    categories: ensureArray([1, 2]),
    createdAt: body.date ? body.date : new Date(Date.now()),
    userId: 1,
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

    res.render(`article/article-edit`, {id, article, categories, validationMessages});
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
  const {id} = req.params;
  const {message} = req.body;

  const newComment = {
    userId: 1,
    text: message,
  };

  try {
    await api.createComment({id, data: newComment});

    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await api.getArticle(id);

    res.render(`article-detail`, {article, validationMessages});
  }
});

// публикации в определённой категории
articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`article-by-category`)
);

module.exports = articlesRouter;
