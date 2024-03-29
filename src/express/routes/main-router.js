'use strict';

const {Router} = require(`express`);

let filename = null;

const {
  ARTICLES_PER_PAGE,
  USER_ROLES,
  MAX_COMMENTS,
  MAX_NUMBER_OF_ELEMENTS,
} = require(`../../constants`);

const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();

const {
  prepareErrors,
  movingFile,
} = require(`../../utils/utils`);

const mainRouter = new Router();

// главная страница
mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  const limit = ARTICLES_PER_PAGE;
  let {page = 1} = req.query;
  page = +page;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories, commentsAll] = await Promise.all([
    api.getArticles({offset, limit, withComments: true}),
    api.getCategories(true),
    api.getComments(),
  ]);

  const comments = commentsAll.slice(0, MAX_COMMENTS);
  comments.forEach((item) => {
    item.text = item.text.substring(0, MAX_NUMBER_OF_ELEMENTS) + `...`;
  });

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {user, page, totalPages, articles, categories, comments});
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
    avatar: file ? file.filename : filename,
    firstName: body.name,
    lastName: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    roleId: USER_ROLES.READER,
  };

  try {
    await api.createUser({data: userData});
    await movingFile(userData.avatar);

    res.redirect(`/login`);
  } catch (errors) {
    filename = userData.avatar;
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
