'use strict';

const Joi = require(`joi`);
const {
  ErrorArticleMessage,
  ErrorCategoriesMessage,
  ErrorUserMessage,
} = require(`../../constants/schemas/messages`);

module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': ErrorArticleMessage.TITLE_MIN,
      'string.max': ErrorArticleMessage.TITLE_MAX,
      'string.empty': ErrorArticleMessage.TITLE_EMPTY,
      'any.required': ErrorArticleMessage.TITLE_REQUIRED,
    }),
  announce: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
      'string.max': ErrorArticleMessage.ANNOUNCE_MAX,
      'string.empty': ErrorArticleMessage.ANNOUNCE_EMPTY,
      'any.required': ErrorArticleMessage.ANNOUNCE_REQUIRED,
    }),
  fulltext: Joi.string()
    .max(250)
    .optional()
    .allow(``)
    .messages({
      'string.max': ErrorArticleMessage.FULLTEXT_MAX,
    }),
  categories: Joi.array()
    .items(
        Joi.number()
          .integer()
          .positive()
          .messages({
            'number.base': ErrorCategoriesMessage.CATEGORIES_ERR,
          })
    ).min(1).required().messages({
      'any.required': ErrorCategoriesMessage.CATEGORIES_EMPTY,
    }),
  picture: Joi.string()
    .allow(null)
    .optional(),
  createdAt: Joi.string()
    .isoDate()
    .required()
    .messages({
      'string.isoDate': ErrorArticleMessage.CREATED_ERR,
      'any.required': ErrorArticleMessage.CREATED_EMPTY,
    }),
  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': ErrorUserMessage.USER_ID,
      'any.required': ErrorArticleMessage.ARTICLE_ID_EMPTY,
    }),
});
