/* eslint-disable class-methods-use-this */
import pages from '../constants/pages.const';
import statisticsProps from '../constants/statisticsProps.const';
import flip from '../utils/flip';
import changeCardMode from '../utils/changeCardMode';
import createElement from '../utils/createElement';
import shuffle from '../utils/shuffle';
import deactivateCard from '../utils/deactivateCard';
import Header from './Header.component';
import Card from './Card.component';

class Game {
  constructor(data, statistics) {
    this.mainContainer = document.querySelector('.main');
    this.rating = document.querySelector('.rating');
    this.burgerMenuBtn = document.querySelector('.header-burger');
    this.menu = document.querySelector('.header-menu');
    this.modeBtn = document.querySelector('input');
    this.statBtn = document.querySelector('.stat-btn');

    this.page = pages.main;
    [this.categories] = data;
    this.categoriesElements = [];
    this.cards = [];
    this.data = data;
    this.mode = false;
    this.rightAnswers = 0;
    this.wrongAnswers = 0;

    this.statistics = statistics;
    this.statistics.generateTable();

    this.startBtn = createElement('button', 'start-btn', createElement('span', null, 'start game'), document.body);

    document.addEventListener('click', this.closeMenu);
    this.modeBtn.addEventListener('change', this.changeMode);
    this.statBtn.addEventListener('click', this.statistics.renderStatistics);
    this.statBtn.addEventListener('click', () => {
      this.page = pages.statistics;
      this.toggleStartBtn();
      const avtivePage = this.header.headerMenu.querySelector('.active-page');
      avtivePage.classList.remove('active-page');
    });
    this.menu.addEventListener('click', this.changePage);
    this.mainContainer.addEventListener('click', this.handleClickOnCard);
    this.startBtn.addEventListener('click', this.startGame);
  }

  generateHeader() {
    this.header = new Header();
    this.header.generateHeaderMenu(this.categories);
  }

  generateCategories() {
    const isCategoryCard = true;
    const CardType = 'category';
    this.categories.forEach((category, index) => {
      const categoryCard = new Card(this.data[index + 1][1].image, category).createCard(isCategoryCard, CardType);
      this.categoriesElements.push(categoryCard);
    });
  }

  generateCards(category) {
    const isCategoryCard = false;
    const CardType = 'word';
    this.data[this.categories.indexOf(category) + 1].forEach((cardObj) => {
      const {
        image,
        word,
        translation,
        audioSrc: audio
      } = cardObj;
      const card = new Card(image, word, translation, audio).createCard(isCategoryCard, CardType);
      card.classList.add(this.mode ? 'play' : 'train');
      this.cards.push(card);
    });
  }
  
  appendCategoriesCards() {
    this.mainContainer.innerHTML = '';
    this.categoriesElements.forEach((card) => {
      this.mainContainer.append(card);
    });
    this.categoriesElements.length = 0;
  }
  
  appendCards() {
    this.mainContainer.innerHTML = '';
    this.cards.forEach((card) => {
      this.mainContainer.append(card);
    })
    this.cards.length = 0;
  }

  closeMenu = ({target}) => {
    if (!target.closest('.header-burger') && !target.closest('.header-menu')) {
      this.burgerMenuBtn.classList.remove('opened');
      this.menu.classList.remove('active');
    }
  }

  changePage = ({target}) => {
    if (target.closest('a')) {
      if (this.soundsForPlay) this.soundsForPlay.length = 0;
      this.rating.innerHTML = '';
      this.header.highlightActiveItem(target);
      this.startBtn.isGameStarted = false;
      this.toggleStartBtn();
      const category = target.innerText;
      if (this.categories.includes(category)) {
        this.page = pages.category;
        this.toggleStartBtn();
        this.generateCards(category);
        this.appendCards();
        this.burgerMenuBtn.classList.remove('opened');
        this.menu.classList.remove('active');
      } else {
        this.page = pages.main;
        this.toggleStartBtn();
        this.generateCategories();
        this.appendCategoriesCards();
        this.burgerMenuBtn.classList.remove('opened');
        this.menu.classList.remove('active');
      }
    }
  }

  checkWord(audio, card) {
    if (!this.soundsForPlay || !this.startBtn.isGameStarted) {
      return;
    }
    const wrongStar = createElement('img', 'wrong-star', null, null, ['src', './assets/img/star.svg']);  
    const correctStar = createElement('img', 'correct-star', null, null, ['src', './assets/img/star-win.svg']);
    const correctCard = this.randomCards[0];
    if (audio.src === this.soundsForPlay[0]) {
      const newSound = new Audio(this.soundsForPlay[1]);
      deactivateCard(card);
      new Audio('./assets/audio/correct.mp3').play();
      this.rating.prepend(correctStar);
      setTimeout(() => newSound.play(), 1000);
      this.soundsForPlay.shift();
      this.randomCards.shift();
      this.rightAnswers += 1;
      this.showGameResult();
      this.statistics.updateStatistics(card.dataset.word, statisticsProps.correctAnswers);
    } else {
      new Audio('./assets/audio/error.mp3').play();
      this.rating.prepend(wrongStar);
      this.wrongAnswers += 1;
      if (correctCard) {
        this.statistics.updateStatistics(correctCard.dataset.word, statisticsProps.wrongAnswers);
      }
    }
  }

  handleClickOnCard = ({target}) => {
    const card = target.closest('.card');
    if (card) {
      if (card.dataset.type === 'category') {
        this.page = pages.category;
        const category = card.querySelector('.card-front__text').innerText;
        this.header.highlightActiveItem(category);
        this.toggleStartBtn();
        this.generateCards(category);
        this.appendCards();
      } else if (card.dataset.type === 'word') {
        this.statistics.updateStatistics(card.dataset.word, statisticsProps.trainTimes);
        if (card.classList.contains('deactivated')) return;
        const audio = card.querySelector('audio');
        if (this.mode) {
          this.checkWord(audio, card)
        } else {
          audio.play();
        }
        if (target.closest('.card-front__rotate')) {
          flip(card);
        }
      }
    }
  }

  toggleStartBtn() {
    this.startBtn.classList.remove('repeat');
    this.startBtn.addEventListener('click', this.startGame);
    if (this.mode && this.page === pages.category) {
      this.startBtn.classList.add('active');
    } else {
      this.startBtn.classList.remove('active');
    }
  }

  changeMode = () => {
    this.mode = !this.mode;
    this.startBtn.isGameStarted = false;
    this.soundsForPlay = 0;
    this.toggleStartBtn();
    this.rating.innerHTML = '';
    const cards = document.querySelectorAll('div[data-type="word"]');
    changeCardMode(cards, this.mode);
  }

  getRandomCards() {
    const cards = Array.from(document.querySelectorAll('div[data-type="word"]'));
    shuffle(cards);
     const sounds = Array.from(cards).map((card) => {
      return card.querySelector('audio').src;
    });
    return {
      sounds,
      cards
    }
  }

  repeatWord = () => {
    new Audio(this.soundsForPlay[0]).play();
  }

  showGameResult() {
    if (this.soundsForPlay.length === 0) {
      const endGameImg = this.wrongAnswers ? 'failure' : 'success';
      const endGameAudio = this.wrongAnswers ? './assets/audio/failure.mp3' : './assets/audio/success.mp3'; 
      this.rating.remove();
      this.mainContainer.innerHTML = '';
      this.page = pages.main;
      this.toggleStartBtn();
      const endGameMessage = createElement('div', 'end-game', 
        [createElement('img', 'end-game__img', null, null, ['src', `./assets/img/${endGameImg}.jpg`]),
        createElement('div', 'end-game__wrongAnswers', `неправильных ответов ${this.wrongAnswers}`),
      ]);
      new Audio(endGameAudio).play();
      document.body.append(endGameMessage);
      setTimeout(() => endGameMessage.remove(), 3000);
      setTimeout(() => {
        this.generateCategories();
        this.appendCategoriesCards()
      }, 3500);
      this.startBtn.isGameStarted = false;
    }
  }

  startGame = () => {
    this.wrongAnswers = 0;
    const randomCards = this.getRandomCards();
    this.randomCards = randomCards.cards;
    this.soundsForPlay = randomCards.sounds;
    this.startBtn.classList.add('repeat');
    this.startBtn.isGameStarted = true;
    new Audio(this.soundsForPlay[0]).play();
    this.startBtn.removeEventListener('click', this.startGame);
    this.startBtn.addEventListener('click', this.repeatWord);
  }

  init() {
    this.generateHeader();
    this.generateCategories();
    this.appendCategoriesCards();
  }
}

export default Game;
