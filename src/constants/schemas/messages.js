'use strict';

module.exports.ErrorUserMessage = {
  USER_ID: `Некорректный идентификатор пользователя`,
  FIRST_NAME_ERR: `Имя содержит некорректные символы`,
  FIRST_NAME_EMPTY: `Не указано имя`,
  LAST_NAME_ERR: `Фамилия содержит некорректные символы`,
  LAST_NAME_EMPTY: `Не указана фамилия`,
  EMAIL_ERR: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  EMAIL_EMPTY: `Не указан email`,
  PASSWORD_ERR: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_EMPTY: `Не указан пароль`,
  PASSWORD_REPEATED_ERR: `Пароли не совпадают`,
  PASSWORD_REPEATED_EMPTY: `Не указан повторный пароль`,
  AVATAR_ERR: `Изображение не выбрано или тип изображения не поддерживается`,
  AUTH_EMAIL: `Электронный адрес не существует`,
  AUTH_PASSWORD: `Неверный пароль`,
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
  TEXT_EMPTY: `Отсутствует комментарий`,
  USER_ID_EMPTY: `Не указан пользователь, создавший комментарий`,
};

module.exports.ErrorParamRequest = {
  PARAM_ERR: `Ошибка в параметре запроса`,
};
