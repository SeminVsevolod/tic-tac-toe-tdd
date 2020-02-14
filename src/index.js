import DomController from './DomController';
import Game from './game';

const game = new Game();
const dom = new DomController({
    root: '#root',
    game
});

dom.init();