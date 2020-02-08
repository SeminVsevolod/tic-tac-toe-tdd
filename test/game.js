import {expect} from 'chai';
import Game from '../src/Game';

const USER_NAME = 'user';
const COMPUTER_NAME = 'computer';
const USER_MOVE_SYMBOL = '×';
const INITIAL_GAME_BOARD = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let game;
beforeEach(() => {
    game = new Game();
});

describe('Game', () => {
    it('Should return empty game board', () => {
        const board = game.getState();
        expect(board).to.deep.equal(INITIAL_GAME_BOARD);
    });

    it('Writes user\'s symbol in cell with given coordinates', () => {
        const x = 1, y = 1;
        game.acceptUserMove(x, y);
        const board = game.getState();
        expect(board[x][y]).to.equal(USER_MOVE_SYMBOL);
    });

    it('Throws an exception if user moves in taken cell', () => {
        const x = 2, y = 2;
        game.acceptUserMove(x, y);
        const func = game.acceptUserMove.bind(game, x, y);
        expect(func).to.throw('cell is already taken');
    });

    it('Computer moves in top left cell', () => {
        game.createComputerMove();
        const board = game.getState();

        expect(board[0][0]).to.equal('o');
    });

    it('Game saves user\'s move in history', () => {
        const x = 1, y = 1;

        game.acceptUserMove(x, y);
        const history = game.getMoveHistory();

        expect(history).to.deep.equal([{turn: USER_NAME, x, y}]);
    });

    it('Game saves computers\'s move in history', () => {
        game.createComputerMove();
        const history = game.getMoveHistory();

        expect(history).to.deep.equal([{turn: COMPUTER_NAME, x: 0, y: 0}]);
    });

    it('Game saves 1 user\'s move and 1 computer\'s move in history', () => {
        const x = 1, y = 1;

        game.acceptUserMove(x, y);
        game.createComputerMove();
        const history = game.getMoveHistory();

        expect(history.length).to.equal(2);
        expect(history[0].turn).to.equal(USER_NAME);
        expect(history[1].turn).to.equal(COMPUTER_NAME);
    });
});