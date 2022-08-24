'use strict';

const express = require(`express`);

const myCommentsRoutes = require(`./routes/comments`);
const articlesRoutes = require(`./routes/articles`);
const mainRoutes = require(`./routes/main-router`);

const {PORT_FOR_EXPRESS} = require(`../service/const/constants`);

const app = express();
app.use(express.json());

app.use(`/`, mainRoutes);
app.use(`/my`, myCommentsRoutes);
app.use(`/articles`, articlesRoutes);

app.listen(PORT_FOR_EXPRESS, () => {
  console.log(`Сервер запущен на ${PORT_FOR_EXPRESS} порту`);
});
