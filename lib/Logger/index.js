/**
 * @file Custom Logger Library.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 */

import chalk from 'chalk';
import ora from 'ora';

/* eslint-disable jsdoc/valid-types */
/** @typedef { import('ora').Ora } OraSpinner */

/**
 * @class
 * @description Logger library.
 *
 * @hideconstructor
 *
 * @exports Lib/Logger
 */
class Logger {
  static #lastMessage = {
    message: '',
    count: 1,
  };

  static #timers = {};

  /**
   * @description Print given value as a debug message in the console.
   *
   * @param {any} value - The value to print.
   */
  static debug(value) {
    const valueToPrint = typeof value === 'object' ? value.toString() : value;
    if (Logger.#lastMessage.message === valueToPrint) {
      Logger.#lastMessage.count += 1;
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `${Logger.#prefixes.debug} ${Logger.#prefixes.pipe} ${valueToPrint} [x${
          Logger.#lastMessage.count
        }]`,
      );
      return;
    }
    process.stdout.write('\n');
    Logger.#lastMessage.message = valueToPrint;
    Logger.#lastMessage.count = 1;
    process.stdout.write(
      `${Logger.#prefixes.debug} ${Logger.#prefixes.pipe} ${valueToPrint}`,
    );
  }

  /**
   * @description Print given value as an info message in the console.
   *
   * @param {any} value - The value to print.
   */
  static info(value) {
    const valueToPrint = typeof value === 'object' ? value.toString() : value;
    if (Logger.#lastMessage.message === valueToPrint) {
      Logger.#lastMessage.count += 1;
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `${Logger.#prefixes.info} ${Logger.#prefixes.pipe} ${valueToPrint} [x${
          Logger.#lastMessage.count
        }]`,
      );
      return;
    }
    process.stdout.write('\n');
    Logger.#lastMessage.message = valueToPrint;
    Logger.#lastMessage.count = 1;
    process.stdout.write(
      `${Logger.#prefixes.info} ${Logger.#prefixes.pipe} ${valueToPrint}`,
    );
  }

  /**
   * @description Print given value as a warn message in the console.
   *
   * @param {any} value - The value to print.
   */
  static warn(value) {
    const valueToPrint = typeof value === 'object' ? value.toString() : value;
    if (Logger.#lastMessage.message === valueToPrint) {
      Logger.#lastMessage.count += 1;
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `${Logger.#prefixes.warn} ${Logger.#prefixes.pipe} ${valueToPrint}[x${
          Logger.#lastMessage.count
        }]`,
      );
      return;
    }
    process.stdout.write('\n');
    Logger.#lastMessage.message = valueToPrint;
    Logger.#lastMessage.count = 1;
    process.stdout.write(
      `${Logger.#prefixes.warn} ${Logger.#prefixes.pipe} ${valueToPrint}`,
    );
  }

  /**
   * @description Print given value as an error message in the console.
   *
   * @param {any} value - The value to print.
   */
  static error(value) {
    const valueToPrint = typeof value === 'object' ? value.toString() : value;
    if (Logger.#lastMessage.message === valueToPrint) {
      Logger.#lastMessage.count += 1;
      process.stderr.clearLine(0);
      process.stderr.cursorTo(0);
      process.stderr.write(
        `${Logger.#prefixes.error} ${Logger.#prefixes.pipe} ${valueToPrint} [x${
          Logger.#lastMessage.count
        }]`,
      );
      return;
    }
    process.stdout.write('\n');
    Logger.#lastMessage.message = valueToPrint;
    Logger.#lastMessage.count = 1;
    process.stderr.write(
      `${Logger.#prefixes.error} ${Logger.#prefixes.pipe} ${valueToPrint}`,
    );
  }

  /**
   * @description Print given value as a success message in the console..
   *
   * @param {any} value - The value to print.
   */
  static success(value) {
    const valueToPrint = typeof value === 'object' ? value.toString() : value;
    if (Logger.#lastMessage.message === valueToPrint) {
      Logger.#lastMessage.count += 1;
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `${Logger.#prefixes.success} ${
          Logger.#prefixes.pipe
        } ${valueToPrint} [x${Logger.#lastMessage.count}]`,
      );
      return;
    }
    process.stdout.write('\n');
    Logger.#lastMessage.message = valueToPrint;
    Logger.#lastMessage.count = 1;
    process.stdout.write(
      `${Logger.#prefixes.success} ${Logger.#prefixes.pipe} ${valueToPrint}`,
    );
  }

  /**
   * @description Print given value as a fail message in the console.
   *
   * @param {any} value - The value to print.
   */
  static fail(value) {
    const valueToPrint = typeof value === 'object' ? value.toString() : value;
    if (Logger.#lastMessage.message === valueToPrint) {
      Logger.#lastMessage.count += 1;
      process.stderr.clearLine(0);
      process.stderr.cursorTo(0);
      process.stderr.write(
        `${Logger.#prefixes.fail} ${Logger.#prefixes.pipe} ${valueToPrint} [x${
          Logger.#lastMessage.count
        }]`,
      );
      return;
    }
    process.stdout.write('\n');
    Logger.#lastMessage.message = valueToPrint;
    Logger.#lastMessage.count = 1;
    process.stderr.write(
      `${Logger.#prefixes.fail} ${Logger.#prefixes.pipe} ${valueToPrint}`,
    );
  }

  /**
   * @description Print given value as a launch message in the console.
   *
   * @param {any} value - The value to print.
   */
  static launch(value) {
    const valueToPrint = typeof value === 'object' ? value.toString() : value;
    if (Logger.#lastMessage.message === valueToPrint) {
      Logger.#lastMessage.count += 1;
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `${Logger.#prefixes.launch} ${
          Logger.#prefixes.pipe
        } ${valueToPrint} [x${Logger.#lastMessage.count}]`,
      );
      return;
    }
    process.stdout.write('\n');
    Logger.#lastMessage.message = valueToPrint;
    Logger.#lastMessage.count = 1;
    process.stdout.write(
      `${Logger.#prefixes.launch} ${Logger.#prefixes.pipe} ${valueToPrint}`,
    );
  }

  /**
   * @description Print given value as a wait message in the console.
   *
   * @param {any} value - The value to print.
   */
  static wait(value) {
    const valueToPrint = typeof value === 'object' ? value.toString() : value;
    if (Logger.#lastMessage.message === valueToPrint) {
      Logger.#lastMessage.count += 1;
      process.stderr.clearLine(0);
      process.stderr.cursorTo(0);
      process.stderr.write(
        `${Logger.#prefixes.wait} ${Logger.#prefixes.pipe} ${valueToPrint} [x${
          Logger.#lastMessage.count
        }]`,
      );
      return;
    }
    process.stdout.write('\n');
    Logger.#lastMessage.message = valueToPrint;
    Logger.#lastMessage.count = 1;
    process.stderr.write(
      `${Logger.#prefixes.wait} ${Logger.#prefixes.pipe} ${valueToPrint}`,
    );
  }

  /**
   * @description Print given value as a end message in the console.
   *
   * @param {any} value - The value to print.
   */
  static end(value) {
    const valueToPrint = typeof value === 'object' ? value.toString() : value;
    if (Logger.#lastMessage.message === valueToPrint) {
      Logger.#lastMessage.count += 1;
      process.stderr.clearLine(0);
      process.stderr.cursorTo(0);
      process.stderr.write(
        `${Logger.#prefixes.end} ${Logger.#prefixes.pipe} ${valueToPrint} [x${
          Logger.#lastMessage.count
        }]`,
      );
      return;
    }
    process.stdout.write('\n');
    Logger.#lastMessage.message = valueToPrint;
    Logger.#lastMessage.count = 1;
    process.stderr.write(
      `${Logger.#prefixes.end} ${Logger.#prefixes.pipe} ${valueToPrint}`,
    );
  }

  /**
   * @description Print given value as a end message in the console.
   *
   * @param   {object}     settings             - Configuration object.
   * @param   {string}     settings.message     - The message to print.
   * @param   {string}     [settings.timerName] - The name of the timer.
   *
   * @returns {OraSpinner}                      - The Spinner Instance.
   */
  static loader({ message, timerName = null }) {
    Logger.#lastMessage.message = message;
    Logger.#lastMessage.count = 1;
    const spinner = ora(`${Logger.#prefixes.pipe} ${message}`).start();
    if (typeof timerName === 'string' && timerName.length !== 0) {
      Logger.#timers[timerName] = Date.now();
    }
    return spinner;
  }

  /**
   * @description Kill the given spinner with the given parameters.
   *
   * @param {object}                                          settings             - Configuration object.
   * @param {OraSpinner}                                      settings.spinner     - The instance of spinner to kill.
   * @param {'succeed'|'fail'|'warn'|'info'|'stopAndPersist'} settings.killStatus  - The method to end the spinner with.
   * @param {string}                                          settings.killMessage - The message to end the spinner with.
   * @param {string}                                          [settings.timerName] - The timer to end.
   *
   * @throws {Error} - The given killStatus isn't allowed.
   */
  static killLoader({ spinner, killStatus, killMessage, timerName = null }) {
    const allowedKillStatus = [
      'succeed',
      'fail',
      'warn',
      'info',
      'stopAndPersist',
    ];
    if (!allowedKillStatus.includes(killStatus))
      throw new Error('❌ Unauthorized method');

    let timeFormatted = null;
    if (Logger.#timers[timerName] !== undefined) {
      const time = Logger.getTimeUnits(Date.now() - Logger.#timers[timerName]);
      const hoursString = time.hours !== 0 ? `${time.hours}h ` : '';
      const minutesString = time.minutes !== 0 ? `${time.minutes}m ` : '';
      const secondsString = time.seconds !== 0 ? `${time.seconds}s ` : '';
      const millisecondsString =
        time.milliseconds !== 0 ? `${time.milliseconds}ms ` : '';
      timeFormatted = `( ${hoursString}${minutesString}${secondsString}${millisecondsString})`;
    }
    spinner[killStatus](`${killMessage} ${timeFormatted}`);
  }

  /**
   * @description That function defines time from duration.
   *
   * @param   {number} duration - The duration to calculate.
   * @returns {object}          - The time by hours, minutes, seconds and milliseconds.
   */
  static getTimeUnits(duration) {
    const MILLISECOND = 1;
    const SECOND = MILLISECOND * 1_000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;

    const hours = Math.floor(duration / HOUR);

    const remainingMinutesInMilliseconds = duration - hours * HOUR;
    const minutes = Math.floor(remainingMinutesInMilliseconds / MINUTE);

    const remainingSecondsInMilliseconds =
      remainingMinutesInMilliseconds - minutes * MINUTE;
    const seconds = Math.floor(remainingSecondsInMilliseconds / SECOND);

    const remainingMilliseconds =
      remainingSecondsInMilliseconds - seconds * SECOND;
    const milliseconds = remainingMilliseconds;

    return {
      hours,
      minutes,
      seconds,
      milliseconds,
    };
  }

  static #prefixes = {
    debug: '  🔵  ',
    info: '  🟡  ',
    warn: '  🟠  ',
    error: '  🔴  ',
    pipe: chalk.bold('|'),
    success: '  ✅  ',
    fail: '  ❌  ',
    launch: '  🚀  ',
    wait: '  ⏱️  ',
    end: '  🎉  ',
  };
}

export default Logger;
