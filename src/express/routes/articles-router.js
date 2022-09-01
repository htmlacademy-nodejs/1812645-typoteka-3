'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();

const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {ensureArray, prepareErrors, prepareErrorsToArray} = require(`../../utils/utils`);
const {
  ARTICLES_BY_CATEGORY_PER_PAGE,
} = require(`../../constants`);

const articlesRouter = new Router();

const csrfProtection = csrf();

const getAddOfferData = () => {
  return api.getCategories({withCount: false});
};

// страница создания новой публикации
articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const categories = await getAddOfferData();
  const current = undefined;

  res.render(`article/article-add`, {categories, csrfToken: req.csrfToken(), current});
});

// запрос на создание новой публикации
articlesRouter.post(`/add`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  let currentCategories = ensureArray(body.categories);

  const articleData = {
    picture: file ? file.filename : null,
    title: body.title,
    announce: body.announce,
    fulltext: body.fulltext,
    categories: currentCategories,
    createdAt: body.date ? body.date : new Date(Date.now()),
    userId: user.id,
  };

  try {
    await api.createArticle(articleData);

    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrorsToArray(errors);
    const validationObject = prepareErrors(errors);
    const categories = await getAddOfferData();

    res.render(`article/article-add`, {
      user, articleData, categories, currentCategories,
      validationMessages, validationObject,
      csrfToken: req.csrfToken()
    });
  }
});

// страница редактирования публикации
articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const [articleData, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  const currentCategories = articleData.categories.map((item) => item.id);

  res.render(`article/article-edit`, {
    id, user, articleData, categories, currentCategories,
    csrfToken: req.csrfToken(),
  });
});

// запрос на редактирование публикации
articlesRouter.post(`/edit/:id`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body, file} = req;
  const currentCategories = ensureArray(body.categories).map((item) => +item);

  const articleData = {
    picture: file ? file.filename : null,
    title: body.title,
    announce: body.announce,
    fulltext: body.fulltext,
    categories: currentCategories,
    createdAt: body.date ? body.date : new Date(Date.now()),
    userId: user.id,
  };

  try {
    await api.editArticles({id, data: articleData});

    res.redirect(`/my`);
  } catch (errors) {
    const validationObject = prepareErrors(errors);

    const categories = await api.getCategories();

    res.render(`article/article-edit`, {
      id, user, validationObject,
      articleData, categories, currentCategories,
      csrfToken: req.csrfToken(),
    });
  }
});

// страница публикации
articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const article = await api.getArticle(id);

  res.render(`article-detail`, {user, article, csrfToken: req.csrfToken()});
});

// создание комментария к публикации
articlesRouter.post(`/:id/comments`, upload.single(`avatar`), csrfProtection, async (req, res) => {
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

    res.render(`article-detail`, {user, article, validationMessages, csrfToken: req.csrfToken()});
  }
});

// публикации в определённой категории
articlesRouter.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const limit = ARTICLES_BY_CATEGORY_PER_PAGE;
  let {page = 1} = req.query;
  page = +page;
  const offset = (page - 1) * ARTICLES_BY_CATEGORY_PER_PAGE;

  const {count, articles} = await api.getArticlesByCategory({id, offset, limit});
  const categories = await api.getCategories(true);
  const category = await api.getCategory(id);

  const totalPages = Math.ceil(count / ARTICLES_BY_CATEGORY_PER_PAGE);

  res.render(`article-by-category`, {
    id, user, page, totalPages,
    category, categories, articles
  });
});

module.exports = articlesRouter;
