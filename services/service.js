/**
 * @file Service Class.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 */

/* eslint-disable jsdoc/valid-types */
/** @typedef {import('@sequelize/core').WhereOptions} WhereOptions */

/* eslint-enable jsdoc/valid-types */

/**
 * @description Service based class, it implements the default methods to communicate with database.
 *
 * @class
 */
class Service {
  static model = null;
  /**
   * @description Get all datas from database of a specific model and returns it.
   *
   * @param   {object}            [settings] - the settings for the findAll method.
   *
   * @returns {Promise<object[]>}            - The data.
   */
  static async getAll(settings) {
    if (settings !== undefined) {
      const datas = await this.model.findAll({ ...settings });
      return datas;
    }

    const datas = await this.model.findAll();
    return datas;
  }

  /**
   * @description Create a new data in database on a specific model with given params.
   *
   * @param {object} params - The given parameters.
   */
  static async createOne(params) {
    const data = await this.model.create({ ...params });
    return data;
  }

  /**
   * @description Search a data in database on a specific model with given params, and if not found, create it and return the created boolean.
   *
   * @param   {WhereOptions}     where      - The where of the findOrCreate method.
   * @param   {object}           [settings] - The defaults of the findOrCreate method.
   *
   * @returns {Promise<boolean>}            - Returns true if created.
   */
  static async findOrCreate(where, settings) {
    if (settings !== undefined) {
      const creation = await this.model.findOrCreate({ where, ...settings });
      return creation;
    }

    const creation = await this.model.findOrCreate({ where });
    return creation;
  }

  /**
   * @description Get one data from database on a specific model based on given param and returns it.
   *
   * @param   {WhereOptions}    where      - The where of the findOne method.
   * @param   {object}          [settings] - The settings for the findOne method.
   *
   * @returns {Promise<object>}            - The data.
   */
  static async getOne(where, settings) {
    if (settings !== undefined) {
      const data = await this.model.findOne({
        where,
        ...settings,
      });
      return data;
    }
    const data = await this.model.findOne({ where });
    return data;
  }

  /**
   * @description Modify one data from database on a specific model based on given param.
   *
   * @param {object}       data  - The data to modify.
   * @param {WhereOptions} where - The where of the update method.
   */
  static async updateOne(data, where) {
    const updatedDatas = await this.model.update({ ...data }, { where });
    return updatedDatas;
  }

  /**
   * @description Delete one data from database on a specific model based on given param.
   *
   * @param {WhereOptions} where - The where of the destroy method.
   */
  static async deleteOne(where) {
    const deletedDatas = await this.model.destroy({ where });
    return deletedDatas;
  }
}
export default Service;
