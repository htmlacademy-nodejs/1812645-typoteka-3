'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`../../constants`);
const {ErrorCategoriesMessage} = require(`../../constants/schemas/messages`);

const schema = Joi.object({
  name: Joi.string()
  .min(5)
  .max(30)
  .required()
  .messages({
    'string.min': ErrorCategoriesMessage.NAME_MIN,
    'string.max': ErrorCategoriesMessage.NAME_MAX,
    'string.empty': ErrorCategoriesMessage.CATEGORIES_EMPTY,
    'string.base': ErrorCategoriesMessage.CATEGORIES_ERR,
    'any.required': ErrorCategoriesMessage.CATEGORIES_REQUIRED,
  }),
});

module.exports = (req, res, next) => {
  const newCategory = req.body;

  const {error} = schema.validate(newCategory, {abortEarly: false});

  if (error) {
    const errorMessage = error.details.reduce((acc, item) => ({
      [item.path]: item.message,
      ...acc
    }), {});

    return res.status(HttpCode.BAD_REQUEST).send(errorMessage);
  }

  res.locals.newCategory = newCategory;
  return next();
};
