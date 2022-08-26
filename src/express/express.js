'use strict';

const express = require(`express`);
const session = require(`express-session`);
const path = require(`path`);

const myCommentsRoutes = require(`./routes/admin-router`);
const articlesRoutes = require(`./routes/articles-router`);
const mainRouter = require(`./routes/main-router`);

const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const {
  PUBLIC_DIR,
  UPLOAD_DIR,
  PORT_FOR_FRONT,
} = require(`../constants`);

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(express.json());
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRouter);
app.use(`/my`, myCommentsRoutes);
app.use(`/articles`, articlesRoutes);

app.listen(PORT_FOR_FRONT, () => {
  console.log(`Сервер запущен на ${PORT_FOR_FRONT} порту`);
});
