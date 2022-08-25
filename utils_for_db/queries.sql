-- Получить список всех категорий (идентификатор, наименование категории);
SELECT id, name FROM categories;

-- Получить список категорий, для которых создано минимум одно объявление (идентификатор, наименование категории);
SELECT id, name FROM categories
  JOIN articles_categories
    ON id = category_id
GROUP BY id

-- Получить список всех категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);
SELECT id, name, count(article_id) FROM categories
  LEFT JOIN articles_categories
    ON id = category_id
GROUP BY id;

-- Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации,
-- имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;
SELECT
  articles.id, title, announce, articles.created_at,
  users.first_name, users.last_name, users.email,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
GROUP BY articles.id, users.id
ORDER BY articles.created_at DESC;

-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации,
-- дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT
  articles.id, title, announce, full_text, articles.created_at, picture,
  users.first_name, users.last_name, users.email,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  COUNT(comments.id) AS comments_count
FROM articles
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
WHERE articles.id = 1
GROUP BY articles.id, users.id;

-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации,
-- имя и фамилия автора, текст комментария);
SELECT
  comments.id, comments.article_id,
  users.first_name, users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
LIMIT 5;


-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации,
-- имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT
  comments.id, comments.article_id,
  users.first_name, users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 2
LIMIT 5;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
