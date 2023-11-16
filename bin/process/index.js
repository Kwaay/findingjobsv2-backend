/**
 * @file Process for choosing the jobs provenance.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Process
 */
import '../../config';
import Logger from '../../lib/Logger';
import enquirer from 'enquirer';
import puppeteer from 'puppeteer';

console;

/**
 * @class
 * @description PE, WTTJ, Monster, Hellowork & Indeed Jobs Parser.
 */
class Process {
  /**
   * @constructs Process
   * @description The constructor function is called when the class is instantiated.
   */
  constructor() {
    this.boot();
  }

  /**
   * @description It asks the user what they want to import, then launches the module according to the response.
   *
   * @returns {Promise<void>} The selected modules.
   */
  async boot() {
    // @ts-ignore
    const promptForJobTypes = new enquirer.MultiSelect({
      name: 'value',
      message: 'De quelle provenance souhaitez-vous rechercher des jobs ?',
      choices: [
        { name: 'Pole-Emploi', value: 'PE' },
        { name: 'WelcomeToTheJungle', value: 'WTTJ' },
        { name: 'Monster', value: 'Monster' },
        {
          name: 'Hellowork',
          value: 'Hellowork',
        },
        {
          name: 'Indeed',
          value: 'Indeed',
        },
      ],
      /**
       * @description Helps getting the corresponding values of selected options.
       *
       * @param   {string[]} names - List of selected options names.
       * @returns {object}         - The key value association for the selected options.
       */
      result(names) {
        return this.map(names);
      },
    });
    const actions = await promptForJobTypes.run().catch(console.error);
    if (actions === undefined) {
      console.error(`❌ No actions were selected`);
      return;
    }
    const selectedActions = Object.values(actions);
    const browser = await puppeteer.launch();
  }
}

// eslint-disable-next-line no-new
new Process();
