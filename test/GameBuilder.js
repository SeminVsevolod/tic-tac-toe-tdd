import Game from '../src/Game';
import {COMPUTER_MOVE_SYMBOL, USER_MOVE_SYMBOL} from "../src/const";

class GameBuilder {
    constructor() {
        this.game = new Game();
    }

    withBoardState(state) {
        state = state
            .split('\n')
            .filter(item => !!item.trim())
            .map(item => item.trim().split(' '));

        state.forEach((item, i) => {
            item.forEach((symbol, j) => {
                if (symbol === USER_MOVE_SYMBOL) this.game.acceptUserMove(i, j, USER_MOVE_SYMBOL);
                if (symbol === COMPUTER_MOVE_SYMBOL) this.game.acceptUserMove(i, j, COMPUTER_MOVE_SYMBOL);
            });
        });

        // will allow us to chain methods
        return this;
    }

    build() {
        return this.game;
    }
}

export default GameBuilder;