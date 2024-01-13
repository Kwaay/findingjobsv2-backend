/**
 * @file Browser Class.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Class/Browser
 */

import puppeteer from 'puppeteer';

/**
 * @description Browser error class used to describe HTTP response that must be returned.
 *
 * @class
 */

class Browser {
  static async launchBrowser() {
    const instance = await puppeteer.launch({
      args: ['--no-sandbox', '--single-process'],
      headless: false,
    });
    return instance;
  }
  // static async closeBrowser(instance) {
  //   await instance.close();
  // }
  // static async connectBrowser(instance) {
  //   await instance.connect();
  // }
  // static async disconnectBrowser(instance) {
  //   await instance.disconnect();
  // }
}
export default Browser;
