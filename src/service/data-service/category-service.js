'use strict';

const {Sequelize} = require(`sequelize`);
const Aliases = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(categoryData) {
    const category = await this._Category.create(categoryData);

    return category.get();
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`articleCategory.CategoryId`),
            ),
            `count`
          ]
        ],
        include: [{
          model: this._ArticleCategory,
          as: Aliases.ARTICLE_CATEGORY,
          attributes: []
        }],
        group: [Sequelize.col(`id`)],
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }

  async findOne(categoryId) {
    return await this._Category.findOne({
      where: {
        id: categoryId,
      }
    });
  }

  async update(id, newCategory) {
    const [affectedRows] = await this._Category.update(newCategory, {
      where: {id}
    });

    return !!affectedRows;
  }

  async delete(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CategoryService;
