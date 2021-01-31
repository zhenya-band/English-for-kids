import './scss/style.scss';

import data from './js/data/cards.data';
import Statistics from './js/components/Statistics.component';
import Game from './js/components/Game.component';

const statistics = new Statistics(data);
new Game(data, statistics).init();
