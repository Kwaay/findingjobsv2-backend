/**
 * @file Job Class based on Service.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 */

import Service from './service';
import Models from '../models';
import HttpError from '../class/HttpError';

/**
 * @description Job Class, it extends from Service who implements the default methods to communicate with database.
 * And add a validate method.
 *
 * @class
 */
class Job extends Service {
  static model = Models.Job;
}
export default Job;
