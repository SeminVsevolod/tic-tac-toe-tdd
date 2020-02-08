export default class Game {
    constructor() {
        this._userName = 'user';
        this._computerName = 'computer';
        this._userMoveSymbol = '×';
        this._computerMoveSymbol = 'o';
        this._history = [];
        this._board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
    }

    getState() {
        return this._board;
    }

    acceptUserMove(x, y) {
        if (!this._isCellFree(x,y)) {
            return this._throwException('cell is already taken');
        }
        this._updateHistory(this._userName, x, y);
        this._updateBoard(x, y);
    }

    createComputerMove() {
        this._updateHistory(this._computerName, 0, 0);
        this._updateBoard(0,0, {
            symbol: this._computerMoveSymbol
        })
    }

    getMoveHistory() {
        return this._history;
    }

    _updateBoard(x, y, config = {}) {
        const {symbol = this._userMoveSymbol} = config;
        this._board[x][y] = symbol;
    }

    _updateHistory(turn, x, y) {
       this._history.push({turn, x, y});
    }

    _isCellFree(x, y) {
        return !this._board[x][y];
    }

    _throwException(msg) {
       throw new Error(msg);
    }
}