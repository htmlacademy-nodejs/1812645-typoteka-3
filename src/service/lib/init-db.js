'use strict';

const defineModels = require(`../models`);
const Aliases = require(`../models/aliase`);

module.exports = async (sequelize, {categories, articles, users, roles}) => {
  const {Category, Article, User, Role} = defineModels(sequelize);
  await sequelize.sync({force: true});

  await Role.bulkCreate(roles.map((item) => ({role: item})));

  users.forEach((user, index) => {
    index === 0 ? user.roleId = 1 : user.roleId = 2;
  });

  const userModels = await User.bulkCreate(users, {include: [Aliases.ARTICLES, Aliases.COMMENTS]});

  const userIdByEmail = userModels.reduce((acc, next) => ({
    [next.email]: next.id,
    ...acc
  }), {});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  articles.forEach((article) => {
    article.userId = userIdByEmail[article.userEmail];
    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.userEmail];
    });
  });

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliases.COMMENTS]});
    await articleModel.addCategories(
        article.categories.map((name) => categoryIdByName[name])
    );
  });

  await Promise.all(articlePromises);
};
