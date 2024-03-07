/**
 * @file processWTTJ Class based on ProcessService.
 */

import ProcessService from './processService';
import JobService from './job';
import WaitListService from './waitList';
import StackService from './stack';
import Logger from '../lib/Logger';
import randomUseragent from 'random-useragent';

const regexContract =
  /((Temps?[ .-]?Partiel?|Autres|BEP|CAP|CDI|CDD|Freelance|Alternance|Stage)[ .-/]?([ .-/]?[ .-/]?(?:Temporaire)?[ .-]?)(\((.*)\))?)/gim;
const regexStart =
  /(Début[ .-]?:[ .-]?(\d{0,2})[ .-]?(?:[a-zéû]+)[ .-]?(\d{2,4}))/gim;
const regexStudy =
  / (CAP|Non spécifié|BEP|[<>]?[ .-]?Bac[ .-][+][0-9][ .-]?[ .-/][ .-]?Master|Sans[ .-]?Diplôme|[<>]?[ .-]?Bac[ .-]?[+]?[ .-]?[0-9]?[ .-]?[ .-/]?[ .-]?(?:Doctorat)?)/gim;
const regexExperience =
  /([><][ .-]?[0-9]?[ .-]?[0-9]?[ .-]?an[s]?|[><][ .-]?[0-9]?[ .-]?[0-9]?[ .-]?mois)/gim;
const regexRemote =
  /(Télétravail[ .-]?ponctuel[ .-]?autorisé|Télétravail[ .-]?partiel[ .-]? possible|Télétravail[ .-]?total[ .-]?possible)/gim;
const regexSalary = /([\d]+(K)? €(?: et )?([\d]+K €)?)/gm;
const regexClear = /(Expérience[ .-]:|Éducation[ .-]:|Salaire[ .-]entre)/gm;

const temporaryWaitList = [];

/**
 * @description ProcessWTTJ Class, it extends from ProcessService who implements the default methods for the process.
 * And add a validate method.
 *
 * @class
 */
class ProcessWTTJ extends ProcessService {
  static async launchCrawl(instance) {
    if (process.env.APP_DEBUG === 'true')
      Logger.launch('Launching WTTJ Parsing');
    const page = await instance.newPage();
    await this.crawlResults(
      'https://www.welcometothejungle.com/fr/jobs?aroundQuery=worldwide&page=1&refinementList%5Bprofession_name.fr.Tech%5D%5B%5D=Dev%20Fullstack&refinementList%5Bprofession_name.fr.Tech%5D%5B%5D=Dev%20Backend&refinementList%5Bprofession_name.fr.Tech%5D%5B%5D=Dev%20Frontendinstance',
      page,
    );
    return temporaryWaitList.length;
  }

  static async launchProcess(instance) {
    if (process.env.APP_DEBUG === 'true')
      Logger.launch('Launching WTTJ Process');
    await this.getData(instance);
  }

  static async crawlResults(url, page, iterations = 1) {
    return new Promise(async (resolve) => {
      if (process.env.APP_DEBUG === 'true')
        Logger.info(`Fetching results from page #${iterations}`);
      const userAgent = randomUseragent.getRandom();
      await page.setUserAgent(userAgent);
      await page.goto(url, { waitUntil: 'networkidle2' });
      if (process.env.APP_DEBUG === 'true')
        Logger.wait('Waiting for Network idle');
      await new Promise((resolve2) => {
        setTimeout(resolve2, 3000);
      });
      if (process.env.APP_DEBUG === 'true') Logger.success('Network idling');
      const links = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll('div[data-role="jobs:thumb"] a'),
        );
        // @ts-ignore
        const linksElement = elements.map((element) => element.href);

        return linksElement;
      });
      for (const link of links) {
        const linkSplit = link.split('?')[0];
        const checkifExistsInWaitList = await WaitListService.getOne({
          url: linkSplit,
          origin: 'WTTJ',
        });
        const checkIfExistsInJobs = await JobService.getOne({
          link: linkSplit,
          origin: 'WTTJ',
        });
        if (checkifExistsInWaitList || checkIfExistsInJobs) continue;

        await WaitListService.createOne({
          url: linkSplit,
          origin: 'WTTJ',
        });
        temporaryWaitList.push(linkSplit);
      }

      const hasNextPage = await page.evaluate(async () => {
        const activePage = document.querySelector(
          'nav[aria-label="Pagination"] ul li:last-child a',
        );

        if (activePage.ariaDisabled !== 'true') {
          // @ts-ignore
          activePage.click();
          await new Promise((resolve3) => {
            setTimeout(resolve3, 500);
          });
          return window.location.href;
        }
        return false;
      });
      if (hasNextPage) {
        if (process.env.APP_DEBUG === 'true')
          Logger.info('🚧 - Next page detected');
        await this.crawlResults(`${hasNextPage}`, page, iterations + 1);
      } else {
        if (process.env.APP_DEBUG === 'true') Logger.end('No more pages');
      }
      resolve();
    });
  }

  static async getData(instance) {
    return new Promise(async (resolve) => {
      const getLinks = await WaitListService.getAll({
        where: {
          origin: 'WTTJ',
        },
        limit: +process.env.LINKS_NUMBER_LIMIT,
      });
      const promises = [];
      for (const item of getLinks) {
        promises.push(this.getHTML(instance, item.url));
        WaitListService.deleteOne({ id: item.id });
      }
      await Promise.all(promises);
      if (getLinks.length > 1) {
        await this.getData(instance);
      }
      resolve();
      if (process.env.APP_DEBUG === 'true') Logger.end('No more links');
    });
  }

  static async findStacks(HTML) {
    const stacks = await StackService.getAll({ where: { visibility: true } });
    const presentStacks = [];
    stacks.forEach(async (stack) => {
      const regex = new RegExp(`(${stack.regex})`, 'gmi');
      const search = regex.test(HTML);
      if (search) {
        presentStacks.push(stack);
      }
    });
    return presentStacks;
  }

  static async getHTML(instance, url) {
    await new Promise(async (resolve) => {
      const page = await instance.newPage();
      if (process.env.APP_DEBUG === 'true') Logger.wait('Fetching page data');
      await page.goto(url);
      await page.setDefaultNavigationTimeout(0);
      page.setRequestInterception(true);
      page.on('request', async (request) => {
        if (
          request.resourceType() === 'fetch' ||
          request.resourceType() === 'image' ||
          request.resourceType() === 'media' ||
          request.resourceType() === 'font'
        ) {
          request.abort();
        } else {
          request.continue();
        }
      });
      await page.waitForSelector('div[id="the-position-section"]');
      // const indisponible = await page.evaluate(async () => {
      //   const indispoElement = document.querySelector(
      //     'div[data-testid="job-section-archived"]',
      //   );
      //   let i = false;
      //   indispoElement !== null ? (i = true) : (i = false);
      //   return i;
      // });
      // if (indisponible === true) {
      //   await page.close();
      // }
      const name = await page.evaluate(() => {
        const nameElement = document.querySelector('h2');
        // @ts-ignore
        return nameElement ? nameElement.innerText : 'Non-indiqué';
      });
      const location = await page.evaluate(() => {
        let locationElement = document.querySelector("i[name='location']");
        if (locationElement !== null) {
          locationElement = locationElement.parentElement;
        }

        return locationElement
          ? // @ts-ignore
            locationElement.innerText.replace(/\s/g, ' ')
          : 'Non-indiqué';
      });
      const contract = await page.evaluate(() => {
        let contractElement = document.querySelector('i[name="contract"]');

        if (contractElement !== null) {
          contractElement = contractElement.parentElement;
        }
        return contractElement
          ? // @ts-ignore
            contractElement.innerText.replace(/\s/g, ' ')
          : 'Non-indiqué';
      });
      const study = await page.evaluate(() => {
        let studyElement = document.querySelector('i[name="education_level"]');
        if (studyElement !== null) {
          studyElement = studyElement.parentElement;
        }
        return studyElement
          ? // @ts-ignore
            studyElement.innerText.replace(/\s/g, ' ').split('Éducation : ')[1]
          : 'Non-indiqué';
      });
      const exp = await page.evaluate(() => {
        let expElement = document.querySelector('i[name="suitcase"]');
        if (expElement !== null) {
          expElement = expElement.parentElement;
        }
        return expElement
          ? // @ts-ignore
            expElement.innerText.replace(/\s/g, ' ').split('Expérience : ')[1]
          : 'Non-indiqué';
      });
      const salary = await page.evaluate(() => {
        let salaryElement = document.querySelector('i[name="salary"]');
        if (salaryElement !== null) {
          salaryElement = salaryElement.parentElement;
        }
        return salaryElement
          ? // @ts-ignore
            salaryElement.innerText.replace(/\s/g, ' ').split('Salaire : ')[1]
          : 'Non-indiqué';
      });
      const remote = await page.evaluate(() => {
        let remoteElement = document.querySelector('i[name="remote"]');
        if (remoteElement !== null) {
          remoteElement = remoteElement.parentElement.querySelector('span');
        }
        return remoteElement
          ? // @ts-ignore
            remoteElement.innerText.replace(/\s/g, ' ')
          : 'Non-indiqué';
      });
      const start = await page.evaluate(() => {
        let startElement = document.querySelector('i[name="clock"]');
        if (startElement !== null) {
          startElement = startElement.parentElement;
        }
        return startElement
          ? // @ts-ignore
            startElement.innerText.replace(/\s/g, ' ').split('Début : ')[1]
          : 'Non-indiqué';
      });
      const content = await page.evaluate(() => {
        let contentElement = document.querySelector('div#the-position-section');

        return contentElement
          ? // @ts-ignore
            contentElement.innerText.replace(/\s/g, ' ')
          : 'Non-indiqué';
      });

      await page.close();
      const presentStacks = await this.findStacks(content);
      const jobCreate = await JobService.createOne({
        name,
        location,
        link: url,
        contract,
        salary,
        remote,
        exp,
        study,
        start,
        type: 'Non-indiqué',
        origin: 'WTTJ',
      });
      const stacksRelations = [];
      presentStacks.forEach((stack) => {
        stacksRelations.push(jobCreate.addStack(stack));
      });
      await Promise.all(stacksRelations);
      resolve();
    });
  }
}

export default ProcessWTTJ;
