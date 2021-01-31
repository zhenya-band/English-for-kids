import createElement from '../utils/createElement';

class Header {
  constructor() {
    this.burgerMenuBtn = document.querySelector('.header-burger');
    this.headerMenu = document.querySelector('.header-menu');

    this.burgerMenuBtn.addEventListener('click', this.toggleMenuBtn);
  }

  toggleMenuBtn = () => {
    this.burgerMenuBtn.classList.toggle('opened');
    this.headerMenu.classList.toggle('active');
  }

  generateHeaderMenu(categories) {
    this.headerMenu.append(createElement('li', 'header-menu__item', 
      createElement('a', 'active-page', 'Main page')));
    categories.forEach((category) => {
      const headerItem = createElement('li', 'header-menu__item', createElement('a', null, category));
      this.headerMenu.append(headerItem);
    });
  }

  highlightActiveItem(target) {
    const menuItems = this.headerMenu.querySelectorAll('a');
    menuItems.forEach((item) => {
      item.classList.remove('active-page');
    });
    if (typeof target === 'string') {
      const itemForHighlight = Array.from(menuItems).find((item) => item.innerText === target);
      menuItems[Array.from(menuItems).indexOf(itemForHighlight)]
        .classList.add('active-page');
    } else {
      target.classList.add('active-page');
    }
  }
}

export default Header;