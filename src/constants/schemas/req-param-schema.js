'use strict';

const Joi = require(`joi`);

const {ErrorParamRequest} = require(`../../constants/schemas/messages`);

module.exports = Joi.object({
  articleId: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': ErrorParamRequest.PARAM_ERR,
    }),
  commentId: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': ErrorParamRequest.PARAM_ERR,
    })
});
