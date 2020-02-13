import {expect} from 'chai';
import sinon from 'sinon';
import jsdom from 'jsdom';

import Game from '../src/Game';
import DomController from '../src/DomContoller';

const {JSDOM} = jsdom;
const dom = new JSDOM('<html lang="en"><body id="root"></body></html>');

const createInstance = (game= {}) => {
    return new DomController({
        game: game,
        root: '#root'
    })
};
const createGame = (board) => new Game(board);

global.window = dom.window;
global.document = dom.window.document;

afterEach(() => {
    document.body.innerHTML = '';
});

describe('DOM controller', () => {
    it('Creates empty table', () => {
        const domController = createInstance();

        domController.createTable();

        expect(document.querySelectorAll('table').length).to.equal(1);
    });

    it('Creates table with 3 rows and 3 columns', () => {
        const domController = createInstance();

        domController.createTable(3, 3);

        expect(document.querySelectorAll('table').length).to.equal(1);
        expect(document.querySelectorAll('tr').length).to.equal(3);
        expect(document.querySelectorAll('td').length).to.equal(9);
    });

    it('Remembers indices of last clicked cell', () => {
        const domController = createInstance();

        domController.createTable(3, 3);
        document.querySelector('table td').click();

        expect(domController.lastClickedIndices).to.deep.equal([0, 0]);
    });

    it('Makes user move in game on cell click', () => {
        const gameMock = {acceptUserMove: sinon.spy()};
        const domController = createInstance(gameMock);

        domController.createTable(3, 3);
        document.querySelector('table td').click();

        expect(domController.game.acceptUserMove.called).to.be.true;
    });

    it('Checks initialization of table by game state', () => {
        const game = createGame();
        const domController = createInstance(game);

        domController.init();

        expect(document.querySelectorAll('table').length).to.equal(1);
        expect(document.querySelectorAll('tr').length).to.equal(3);
        expect(document.querySelectorAll('td').length).to.equal(9);
    });
});