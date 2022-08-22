'use strict';

module.exports.ErrorUserMessage = {
  USER_ID: `Некорректный идентификатор пользователя`,
};

module.exports.ErrorArticleMessage = {
  ARTICLE_ID: `Некорректный идентификатор публикации`,
  ARTICLE_ID_EMPTY: `Не указана id публикации`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  TITLE_EMPTY: `Заголовок публикации не может быть пустым`,
  TITLE_REQUIRED: `Отсутствует заголовок публикации`,
  ANNOUNCE_MIN: `Анонс публикации содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс публикации не может содержать более 250 символов`,
  ANNOUNCE_EMPTY: `Анонс публикации не может быть пустым`,
  ANNOUNCE_REQUIRED: `Отсутствует анонс публикации`,
  FULLTEXT_MAX: `Полный текс публикации не может содержать более 1000 символов`,
  CREATED_ERR: `Некорректная дата создания публикации`,
  CREATED_EMPTY: `Не указана дата создания публикации`,
  PICTURE_ERROR: `Не выбрано изображение для публикации`,
};

module.exports.ErrorCategoriesMessage = {
  CATEGORIES_ERR: `Некорректный тип категории`,
  CATEGORIES_EMPTY: `Не выбрана ни одна категория для публикации`,
};

module.exports.ErrorCommentMessage = {
  TEXT_MIN: `Заголовок содержит меньше 20 символов`,
  TEXT_MAX: `Заголовок не может содержать более 250 символов`,
  USER_ID_EMPTY: `Не указан пользователь, создавший комментарий`,
};

module.exports.ErrorParamRequest = {
  PARAM_ERR: `Ошибка в параметре запроса`,
};
