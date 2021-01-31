import createElement from '../utils/createElement';

class Card {
  constructor(imgSrc, textEn, textRu, audioSrc) {
    this.imageSrc = imgSrc;
    this.textEn = textEn;
    this.textRu = textRu;
    this.audio = new Audio();
    this.audio.src = audioSrc;
    this.rotateBtn = new Image();
    this.rotateBtn.classList.add('card-front__rotate');
    this.rotateBtn.src = './assets/img/rotate.svg';
  }

  createImg() {
    const image = new Image();
    image.src = this.imageSrc;
    return image;
  }

  createCard(isCategoryCard, cardType) {
    if (isCategoryCard) {
      this.cardFront = createElement('div', 'card-front',
      [createElement('div', 'card-front__img', this.createImg()),
      createElement('div', 'card-front__text', this.textEn)]);

      this.cardBack = null;
    } else {
      this.cardFront = createElement('div', 'card-front',
      [createElement('div', 'card-front__img', this.createImg()),
      createElement('div', 'card-front__text', this.textEn), this.rotateBtn]);
      
      this.cardBack = createElement('div', 'card-back', 
      [createElement('div', 'card-back__img', this.createImg()),
      createElement('div', 'card-back__text', this.textRu), this.audio]);
    }
    
    this.card = createElement('div', 'card', [this.cardFront, this.cardBack], null, ['type', cardType], ['word', this.textEn]);
    return this.card;
  }
}

export default Card;
