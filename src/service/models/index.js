'use strict';

const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineUser = require(`./user`);
const defineArticleCategory = require(`./article-category`);
const Aliases = require(`./aliase`);

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const User = defineUser(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  Article.hasMany(Comment, {as: Aliases.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  User.hasMany(Comment, {as: Aliases.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Aliases.USERS, foreignKey: `userId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliases.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliases.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliases.ARTICLE_CATEGORY});

  User.hasMany(Article, {as: Aliases.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Aliases.USERS, foreignKey: `userId`});

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;
