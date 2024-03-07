/**
 * @file Stack Class based on Service.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 */

import Service from './service';
import Models from '../models';

/**
 * @description Stack Class, it extends from Service who implements the default methods to communicate with database.
 * And add a validate method.
 *
 * @class
 */
class Stack extends Service {
  static model = Models.Stack;
}
export default Stack;
