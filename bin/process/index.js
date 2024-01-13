/**
 * @file Process for choosing the jobs provenance.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 *
 * @module Process
 */
import '../../config';
import enquirer from 'enquirer';
import Logger from '../../lib/Logger';
import ProcessPE from '../../services/processPE';
import ProcessWTTJ from '../../services/processWTTJ';
import Browser from '../../class/Browser';

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
    if (Object.keys(actions).length < 1) {
      Logger.error(`No actions were selected`);
      return;
    }
    const selectedActions = Object.values(actions);
    const instance = await Browser.launchBrowser();
    if (selectedActions.includes('PE')) {
      const spinner = Logger.loader({
        message: `Waiting PE`,
        timerName: 'crawlPE',
      });
      const jobsNumber = await ProcessPE.launchCrawl(instance);
      const promise = new Promise((resolve) => {
        setTimeout(async () => {
          await ProcessPE.launchProcess(instance);
          Logger.killLoader({
            spinner,
            killStatus: 'succeed',
            killMessage: `Total PE jobs added: ${jobsNumber}`,
            timerName: 'crawlPE',
          });
          resolve();
        }, 60000);
      });
      await promise;
    }
    if (selectedActions.includes('WTTJ')) {
      const spinner = Logger.loader({
        message: `Waiting WTTJ`,
        timerName: 'crawlWTTJ',
      });
      const jobsNumber = await ProcessWTTJ.launchCrawl(instance);
      await ProcessWTTJ.launchProcess(instance);
      Logger.killLoader({
        spinner,
        killStatus: 'succeed',
        killMessage: `Total WTTJ jobs added: ${jobsNumber}`,
        timerName: 'crawlWTTJ',
      });
    }
  }
}

// eslint-disable-next-line no-new
new Process();
