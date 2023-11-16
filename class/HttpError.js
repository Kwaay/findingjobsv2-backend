/**
 * @file HttpError Class.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Class/HttpError
 */
/**
 * @description HttpError error class used to describe HTTP response that must be returned.
 *
 * @class
 */
class HttpError extends Error {
  /**
   * @description Constructor for HttpError class.
   *
   * @param {object} settings         - The settings for the error.
   * @param {number} settings.code    - The code for the error in settings.
   * @param {string} settings.message - The message for the error in settings.
   *
   */
  constructor({ code, message }) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
export default HttpError;
