/**
 * @file Database connection.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Models/connection
 */

import { Sequelize } from '@sequelize/core';

const sequelize = new Sequelize(
  process.env.DB_BDD,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+02:00',
    /**
     * @description Checks whether debug data from `.env` configuration file.
     *
     * @param   {any}  debug - Data to debug to console.
     * @returns {void}
     */
    logging: (debug) => process.env.APP_DEBUG === 'true' && console.log(debug),
  },
);

export default sequelize;
