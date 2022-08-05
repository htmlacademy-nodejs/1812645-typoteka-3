'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);

const articlesRouter = new Router();

// страница создания новой публикации
articlesRouter.get(`/add`, async (req, res) => {
  res.render(`article-add`);
});

// запрос создания новой публикации
articlesRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    picture: file ? file.file : ``,
    title: `Заголовок публикации`,
    createDate: new Date(Date.now()),
    announce: `Это публикация создана из браузера с помощью post`,
    fulltext: `Тут полный текст публикации`,
    category: `Миру Мир!`,
    comments: [
      {
        "id": `qqHu76`,
        "text": `Это где ж такие красоты? Плюсую, но слишком много буквы!`
      }
    ]
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/`);
  } catch (errors) {
    res.render(`article-add`, {articleData});
  }
});

// редактирование публикации
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  res.render(`article-edit`, {article, categories});
});

// страница публикации
articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const article = await api.getArticle(id);
    res.render(`article-detail`, {article});
  } catch (errors) {
    // res.redirect(`/my`);
    res.render(`article-detail`);
  }
});

// публикации в определённой категории
articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`articles-by-category`)
);

module.exports = articlesRouter;
