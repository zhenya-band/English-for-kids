/* eslint-disable class-methods-use-this */
import createElement from '../utils/createElement';
import comparator from '../utils/comparator';
import {
  setItem,
  getItem
} from '../utils/localStor';

class Statistics {
  constructor(data) {
    this.mainContainer = document.querySelector('.main');
    this.activePage = document.querySelector('.active-page');

    this.tableWrapper = createElement('div', 'stat-wrapper');
    this.tableHead = createElement('thead', 'table-head', createElement('tr', null, [createElement('th', null, 'Words'),
      createElement('th', null, 'Translation'),
      createElement('th', null, 'Train Times'),
      createElement('th', null, 'Correct'),
      createElement('th', null, 'Incorrect'),
      createElement('th', null, '%'),
    ]));

    this.tableBody = createElement('tbody', 'table-body')

    this.table = createElement('table', 'stat-table', [this.tableHead, this.tableBody], this.tableWrapper);
    this.tableHead.addEventListener('click', this.sort);

    this.words = data.slice(1).flat();
    this.words.forEach(({
      word,
      translation
    }) => {
      setItem(word, {
        word,
        translation,
        trainTimes: getItem(word) ? getItem(word).trainTimes : 0,
        correctAnswers: getItem(word) ? getItem(word).correctAnswers : 0,
        wrongAnswers: getItem(word) ? getItem(word).correctAnswers : 0,
        percentageOfCorrect: Math.round(((getItem(word).correctAnswers / 
          (getItem(word).wrongAnswers + getItem(word).correctAnswers)) * 100)) ?
            Math.round(getItem(word).percentageOfCorrect) : 0,
      });
    });
  }

  generateTable() {
    const words = Object.values(localStorage);
    const index = words.indexOf('SILENT');
    if (index > -1) {
      words.splice(index, 1);
    }
    words.forEach((item) => {
      this.tableBody.append(createElement('tr', null, [
        createElement('td', null, JSON.parse(item).word),
        createElement('td', null, JSON.parse(item).translation),
        createElement('td', null, `${JSON.parse(item).trainTimes}`),
        createElement('td', null, `${JSON.parse(item).correctAnswers}`),
        createElement('td', null, `${JSON.parse(item).wrongAnswers}`),
        createElement('td', null, `${JSON.parse(item).percentageOfCorrect}`),
      ]))
    });
  }

  updateStatistics(word, property) {
    const wordObj = getItem(word);
    if (wordObj) {
      wordObj[property] += 1;
      wordObj.percentageOfCorrect =
        Math.round((wordObj.correctAnswers / (wordObj.correctAnswers + wordObj.wrongAnswers)) * 100);
      setItem(word, wordObj);
    }
  }

  renderStatistics = () => {
    this.tableBody.innerHTML = '';
    this.mainContainer.innerHTML = '';
    this.generateTable();
    this.mainContainer.append(this.tableWrapper)
  }

  sort = (event) => {
    const targetElem = event.target;
    targetElem.dataset.order = -(targetElem.dataset.order || -1);
    const {order} = targetElem.dataset;
    const thList = Array.from(targetElem.parentNode.cells);
    const index = thList.indexOf(targetElem);
    const collator = new Intl.Collator(['en', 'ru'], {
      numeric: true
    });
    this.tableBody.append(...Array.from(this.tableBody.rows).sort(comparator(index, order, collator)));
    thList.forEach((th) => {
      th.classList.toggle("sorted", th === targetElem);
    });
  }
}

export default Statistics;
