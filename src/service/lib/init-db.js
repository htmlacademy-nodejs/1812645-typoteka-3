'use strict';

const defineModels = require(`../models`);
const Aliases = require(`../models/aliase`);

module.exports = async (sequelize, {categories, articles, users}) => {
  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  await User.bulkCreate(users);

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliases.COMMENTS]});
    await articleModel.addCategories(
        article.categories[0].map((name) => categoryIdByName[name])
    );
  });

  await Promise.all(articlePromises);
};
