'use strict';

const express = require(`express`);
const path = require(`path`);

const myCommentsRoutes = require(`./routes/comments`);
const articlesRoutes = require(`./routes/articles`);
const mainRoutes = require(`./routes/main-router`);

const {
  PUBLIC_DIR,
  PORT_FOR_EXPRESS,
} = require(`../service/const/constants`);

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myCommentsRoutes);
app.use(`/articles`, articlesRoutes);

app.listen(PORT_FOR_EXPRESS, () => {
  console.log(`Сервер запущен на ${PORT_FOR_EXPRESS} порту`);
});
