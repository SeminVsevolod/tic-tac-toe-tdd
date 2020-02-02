import {expect} from 'chai';

import Game from '../src/Game';

const initialGameBoard = [
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

        expect(board).to.deep.equal(initialGameBoard);
    });
});