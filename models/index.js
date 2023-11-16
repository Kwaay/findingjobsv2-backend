/* eslint-disable no-console */
/**
 * @file Configuration file for the Models.
 * @author DUMONT Benoit <benoit.dumont@contakt.eco>
 *
 * @module Models
 */

import { readdirSync } from 'fs';
import instance from './connection.js';

const db = {
  instance,
};

const modelImportPromises = [];

readdirSync('./models')
  .filter(
    (file) =>
      file.endsWith('.js') && !['index.js', 'connection.js'].includes(file),
  )
  .forEach((file) => {
    console.log(`⏱️ Importing model from ${file} ...`);
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const modelImportPromise = import(`./${file}`);

    modelImportPromise.then((modelBuilder) => {
      const model = modelBuilder.default(instance);
      db[model.name.replaceAll('_', '')] = model;
      console.log(`✅ Model ${model.name} successfully imported.`);
    });

    modelImportPromises.push(modelImportPromise);
  });

await instance
  .authenticate()
  .catch((error) => console.error('❌ Connexion à MySQL invalide', error));
console.log('✅ Connexion à MySQL valide');

await Promise.all(modelImportPromises);

// const forceFkTrue = {
//   foreignKey: {
//     allowNull: true,
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   },
// };
// const forceFkFalse = {
//   foreignKey: {
//     allowNull: false,
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   },
// };

await instance
  .sync()
  .catch((error) =>
    console.error('❌ Impossible de synchroniser les models', error),
  );
console.log('✅ Tous les models ont été synchronisés avec succès.');

export default db;
