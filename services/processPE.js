/**
 * @file processPE Class based on ProcessService.
 */

import ProcessService from './processService';
import WaitListService from './waitList';
import StackService from './stack';
import JobService from './job';
import Logger from '../lib/Logger';
import randomUseragent from 'random-useragent';
import striptags from 'striptags';

const regexContract =
  /((?:Contrat [à])|(?:Mission intérimaire))(?:[- ]+)(|(?:durée (?:in)?déterminée)?)+((?: - )?(?:\d)+ ?(?:Jour(\(s\))|mois|an[s]?))?/gim;

const regexStudy =
  /(?:Bac[ ]?\+\d(?:[,]? )?)+(?:(?:et|ou)(?: plus ou)? équivalents(?: [a-z]+)?)?/gim;
const regexType = /(?:[0-9][0-9]H[0-9]?[0-9]? (Travail en journée))/gim;
const regexSalary =
  /((?:Primes)|(?:((?:a|à) n(?:é|e)gocier))|(?:Selon ((?:le |l'|votre )?(?:exp(?:e|é)rience(?:s)?|profil|(?:â|a)ge| formation | niveau d'(?:e|é)tudes|dipl(?:o|ô)me|comp(?:é|e)tence(s)?)(?: ou| et| \+|\/)?(?: exp(?:e|é)rience| profil| (?:a|â)ge| formation| niveau d'(?:e|é)tudes| dipl(?:o|ô)me|comp(?:é|e)tence(?:s)?)?))|(?:[\d,]+ (?:€|Euros)(?: à [\d,]+ (?:€|Euros))?))/gim;

const baseUrl =
  'https://candidat.pole-emploi.fr/offres/recherche?motsCles=D%C3%A9veloppeur&offresPartenaires=true&rayon=10&tri=0';

const temporaryWaitList = [];

/**
 * @description WaitList, it extends from ProcessService who implements the default methods for the process.
 * And add a validate method.
 *
 * @class
 */
class ProcessPE extends ProcessService {
  static async launchCrawl(instance) {
    if (process.env.APP_DEBUG === 'true') Logger.launch('Launching PE Parsing');
    const page = await instance.newPage();
    await this.crawlResults(page);
    return temporaryWaitList.length;
  }

  static async launchProcess(instance) {
    if (process.env.APP_DEBUG === 'true') Logger.launch('Launching PE Process');
    await this.getData(instance);
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
      const userAgent = randomUseragent.getRandom();
      await page.setUserAgent(userAgent);
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.setDefaultNavigationTimeout(0);
      // const indisponible = await page.evaluate(async () => {
      //   const indispoElement = document.querySelector('.block-offre-indispo');
      //   let i = false;
      //   indispoElement !== null ? (i = true) : (i = false);
      //   return i;
      // });
      // if (indisponible === true) {
      //   await page.close();
      // }
      const name = await page.evaluate(() => {
        const nameElement = document.querySelector('span[itemprop="title"]');
        // @ts-ignore
        return nameElement ? nameElement.innerText : 'Non-indiqué';
      });
      const region = await page.evaluate(() => {
        const regionElement = document.querySelector('span[itemprop="name"]');
        return regionElement
          ? // @ts-ignore
            regionElement.innerText.replace(/\s/g, ' ')
          : 'Non-indiqué';
      });
      const exp = await page.evaluate(() => {
        const expElement = document.querySelector(
          'span[itemprop="experienceRequirements"]',
        );
        return expElement
          ? // @ts-ignore
            expElement.innerText.replace(/\s/g, ' ')
          : 'Non-indiqué';
      });
      const content = await page.evaluate(async () => {
        const paragraph = document.querySelector(
          'main div.modal-content div div',
        );
        return paragraph
          ? // @ts-ignore
            paragraph.innerText.replace(/\s/g, ' ')
          : 'Non-indiqué';
      });
      const contract = (content.match(regexContract) || ['Non-indiqué'])[0];
      const splitContract = content.split(contract).join('');
      const study = (splitContract.match(regexStudy) || ['Non-indiqué'])[0];
      const splitStudy = splitContract.split(study).join('');
      const type = (splitStudy.match(regexType) || ['Non-indiqué'])[0];
      const splitType = splitStudy.split(type).join('');
      const salary = (splitType.match(regexSalary) || ['Non-indiqué'])[0];
      const splitSalary = splitType.split(salary).join('');
      const sContent = striptags(splitSalary).toLowerCase();
      await page.close();
      const presentStacks = await this.findStacks(sContent);
      const jobCreate = await JobService.createOne({
        name,
        location: region,
        link: url,
        contract,
        salary,
        remote: 'Non-indiqué',
        exp,
        study,
        start: 'Non-indiqué',
        type,
        origin: 'PE',
      });
      const stacksRelations = [];
      presentStacks.forEach((stack) => {
        stacksRelations.push(jobCreate.addStack(stack));
      });
      await Promise.all(stacksRelations);
      resolve();
    });
  }

  static async getData(instance) {
    return new Promise(async (resolve) => {
      const getLinks = await WaitListService.getAll({
        where: {
          origin: 'PE',
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

  static async crawlResults(page) {
    const userAgent = randomUseragent.getRandom();
    await page.setUserAgent(userAgent);
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    if (process.env.APP_DEBUG === 'true')
      Logger.wait('Waiting for Network idle');
    await new Promise((resolve2) => {
      setTimeout(resolve2, 10000);
    });
    if (process.env.APP_DEBUG === 'true') Logger.success('Network idling');
    if (process.env.APP_DEBUG === 'true') Logger.wait('Waiting for scroll');
    await this.autoScrollAndMore(page);
    if (process.env.APP_DEBUG === 'true')
      Logger.success('Page scroll complete');
    const links = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('.result a[class="media with-fav"]'),
      );
      // @ts-ignore
      const linksElement = elements.map((element) => element.href);
      return linksElement;
    });
    links.forEach(async (link) => {
      const nLink = link.split('?')[0];
      const checkifExistsInWaitList = await WaitListService.getOne({
        url: nLink,
        origin: 'PE',
      });
      const checkIfExistsInJobs = await JobService.getOne({
        link: nLink,
        origin: 'PE',
      });
      if (checkifExistsInWaitList || checkIfExistsInJobs) return;
      await WaitListService.createOne({
        url: nLink,
        origin: 'PE',
      });
      temporaryWaitList.push(nLink);
    });
  }

  static async autoScrollAndMore(page) {
    await this.autoScroll(page);
    const btn = await this.moreBtn(page);
    if (btn) {
      await this.autoScrollAndMore(page);
    }
  }

  static async moreBtn(page) {
    const hasMoreButton = await page.evaluate(() => {
      const moreBtnSelect = document.querySelector('#zoneAfficherPlus > p > a');
      if (moreBtnSelect) {
        // @ts-ignore
        moreBtnSelect.click();
        return true;
      }
      return false;
    });
    if (hasMoreButton) return true;
    return false;
  }

  static async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 150;
        const timer = setInterval(() => {
          const height = Number(document.body.scrollHeight / 10);
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= height) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
}
export default ProcessPE;
