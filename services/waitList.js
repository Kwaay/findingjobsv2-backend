/**
 * @file waitList Class based on Service.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 */

import Service from './service';
import Models from '../models';
import HttpError from '../class/HttpError';

const ALLOWED_ORIGINS = ['PE', 'WTTJ', 'Monster', 'HelloJobs', 'Indeed'];

/**
 * @description waitList Class, it extends from Service who implements the default methods to communicate with database.
 * And add a validate method.
 *
 * @class
 */
class waitList extends Service {
  static model = Models.waitList;

  /**
   * @description Validate the waitList data.
   *
   * @param   {object}        data           - The data to validate.
   * @param   {string}        data.url      - The given url in data.
   * @param   {string}        data.origin - The given origin in data.
   * @param   {boolean}       strictMode     - The strict mode for nullable inputs.
   *
   * @returns {Promise<true>}                - Returns true if data is valid.
   * @throws {HttpError} - Thrown if data is invalid.
   */
  static async validate(data, strictMode) {
    const { url, origin } = data;

    if (strictMode) {
      if (url === undefined)
        throw new HttpError({ code: 400, message: 'Url must be provided' });
      if (origin === undefined)
        throw new HttpError({ code: 400, message: 'Origin must be provided' });
    }

    if (!ALLOWED_ORIGINS.includes(origin)) {
      throw new HttpError({
        code: 400,
        message: 'The given origin is not in the allowed list',
      });
    }

    if (
      origin === 'PE' &&
      !url.includes('https://candidat.pole-emploi.fr/offres/recherche/detail/')
    ) {
      throw new HttpError({
        code: 400,
        message: "The given PE url doesn't have the correct format",
      });
    }
    if (
      origin === 'WTTJ' &&
      !url.includes('https://www.welcometothejungle.com/fr/companies/')
    ) {
      throw new HttpError({
        code: 400,
        message: "The given WTTJ url doesn't have the correct format",
      });
    }
    return true;
  }
}
export default waitList;
