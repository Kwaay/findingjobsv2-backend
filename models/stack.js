/**
 * @file Stack Model.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Models/Stack
 */
import { DataTypes } from '@sequelize/core';
/* eslint-disable jsdoc/valid-types */
/** @typedef { import('@sequelize/core').Sequelize } Sequelize */
/** @typedef { import('@sequelize/core').Model } Model */
/** @typedef { import('@sequelize/core').ModelStatic<Model> } ModelStatic */
/* eslint-enable jsdoc/valid-types */

/**
 * @description Roles model initializer.
 *
 * @param   { Sequelize }   instance - Sequelize instance linked to database.
 *
 * @returns { ModelStatic }          - Instantiated role model.
 *
 */
const stacksModelBuilder = (instance) =>
  instance.define(
    'Stack',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      regex: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
      },
      visibility: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: 'stack',
    },
  );
export default stacksModelBuilder;
