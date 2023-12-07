/**
 * @file Job Model.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Models/Job
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
const jobsModelBuilder = (instance) =>
  instance.define(
    'Job',
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
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contract: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salary: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      remote: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      exp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      study: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      origin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'Job',
      timestamps: true,
    },
  );
export default jobsModelBuilder;
