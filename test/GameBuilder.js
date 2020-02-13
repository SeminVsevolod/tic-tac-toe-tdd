import Game from '../src/Game';

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
                if (symbol === 'x') this.game.acceptUserMove(i, j);
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