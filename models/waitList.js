/**
 * @file WaitList Model.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Models/WaitList */
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
const waitListModelBuilder = (instance) =>
  instance.define(
    'waitList',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      origin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'waitList',
      timestamps: true,
    },
  );
export default waitListModelBuilder;
