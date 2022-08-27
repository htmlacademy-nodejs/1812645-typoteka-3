'use strict';

const {Router} = require(`express`);

const {
  ARTICLES_PER_PAGE,
  USER_ROLES
} = require(`../../constants`);

const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils/utils`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

// главная страница
mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  const limit = ARTICLES_PER_PAGE;
  let {page = 1} = req.query;
  page = +page;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({offset, limit, withComments: true}),
    api.getCategories(true),
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {user, page, totalPages, articles, categories});
});

// поиск
mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;

  if (!query) {
    res.render(`search`);
    return;
  }

  try {
    const results = await api.search(query);

    res.render(`search-result`, {results, query});
  } catch (error) {
    res.render(`search-result`, {results: []});
  }
});

// Регистрация
mainRouter.get(`/register`, (req, res) =>
  res.render(`sign-up`)
);

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : null,
    firstName: body.name,
    lastName: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    roleId: USER_ROLES.READER,
  };

  try {
    await api.createUser({data: userData});

    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);

    res.render(`sign-up`, {userData, validationMessages});
  }
});

// Логин
mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth(email, password);

    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;

    res.render(`login`, {user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

module.exports = mainRouter;
