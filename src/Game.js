import cloneDeep from 'lodash/cloneDeep';

import {COMPUTER_MOVE_SYMBOL, COMPUTER_NAME, INITIAL_GAME_BOARD, USER_MOVE_SYMBOL, USER_NAME} from './const';

export default class Game {
    constructor(board) {
        this._userName = USER_NAME;
        this._computerName = COMPUTER_NAME;
        this._userMoveSymbol = USER_MOVE_SYMBOL;
        this._computerMoveSymbol = COMPUTER_MOVE_SYMBOL;
        this._fieldSize = 3;
        this._history = [];
        this._board = board || cloneDeep(INITIAL_GAME_BOARD);
    }

    getState() {
        return this._board;
    }

    getSize() {
        return this._fieldSize;
    }

    getMoveHistory() {
        return this._history;
    }

    clear() {
        this._history = [];
        this._board = cloneDeep(INITIAL_GAME_BOARD);
    }

    acceptUserMove(x, y, symbol = USER_MOVE_SYMBOL) {
        if (!this._isCellFree(x, y)) {
            return this._throwException('cell is already taken');
        }
        this._updateHistory(symbol === USER_MOVE_SYMBOL ? this._userName : this._computerName, x, y);
        this._updateBoard(x, y, {symbol});
    }

    createComputerMove() {
        if (this._getFreeCellsCount() === 0) return this._throwException('no cells available');
        let [x, y] = this._getFreeRandomCoordinates();

        // prevent user win next move
        if (this._checkIsUserWillWinNextMove()) {
            [x, y] = this._getCoordinatesToPreventUserWin();
        }

        this.acceptUserMove(x, y, COMPUTER_MOVE_SYMBOL)
    }

    isWinner(player) {
        const symbol = this._getSymbolForPlayer(player);
        const range = this._getRange();
        const isEqual = this._checkCellEqual(symbol);

        const horizontal = range.reduce((res, i) =>
            isEqual(i, 0) && isEqual(i, 1) && isEqual(i, 2) || res, false);

        const vertical = range.reduce((res, j) =>
            isEqual(0, j) && isEqual(1, j) && isEqual(2, j) || res, false);

        const diagonal = isEqual(0, 0) && isEqual(1, 1) && isEqual(2, 2)
            || isEqual(0, 2) && isEqual(1, 1) && isEqual(2, 0);

        return horizontal
            || vertical
            || diagonal;
    }

    checkGame() {
        if (this.isWinner(this._userName)) return `${this._userName} won!`;
        if (this.isWinner(this._computerName)) return `${this._computerName} won!`;
        if (this._getFreeCellsCount() === 0) return `nobody won :–(`;
        return 'continue';
    }

    _getSymbolForPlayer(player) {
        return player === this._userName
               ? this._userMoveSymbol
               : this._computerMoveSymbol;
    }

    _checkCellEqual(symbol) {
        return (i, j) =>
            this._board[i][j] === symbol;
    }

    _checkIsUserWillWinNextMove() {
        // check horizontally win
        return this._board.some(this._callbackRowWithTwoUserMovesAndWithFreeCell)
            || this._checkIsColumnWithTwoUserMovesAndWithFreeCell()
            || this._checkIsMainDiagonalWithTwoUserMovesAndWithFreeCell()
            || this._checkIsSecondaryDiagonalWithTwoUserMovesAndWithFreeCell();
    }

    _callbackRowWithTwoUserMovesAndWithFreeCell(row) {
        return row.reduce((count, cell) => cell === USER_MOVE_SYMBOL ? ++count : count, 0) === 2
        && row.reduce((count, cell) => cell === '' ? ++count : count, 0) === 1;
    }

    _checkIsColumnWithTwoUserMovesAndWithFreeCell() {
        const range = this._getRange();

        return range.some((columnIndex) =>
            this._board.reduce((count, row) =>
                row[columnIndex] === USER_MOVE_SYMBOL ? ++count : count, 0) === 2
            && this._board.reduce((count, row) =>
                row[columnIndex] === '' ? ++count : count, 0) === 1);
    }

    _checkIsMainDiagonalWithTwoUserMovesAndWithFreeCell() {
        const range = this._getRange();

        return range.reduce((count, rangeIndex) => this._board[rangeIndex][rangeIndex] === USER_MOVE_SYMBOL ? ++count : count, 0) === 2
            && range.reduce((count, rangeIndex) => this._board[rangeIndex][rangeIndex] === '' ? ++count : count, 0) === 1;
    }

    _checkIsSecondaryDiagonalWithTwoUserMovesAndWithFreeCell() {
        const range = this._getRange();

        return range.reduce((count, rangeIndex) => this._board[rangeIndex][Math.abs(rangeIndex - 2)] === USER_MOVE_SYMBOL ? ++count : count, 0) === 2
            && range.reduce((count, rangeIndex) => this._board[rangeIndex][Math.abs(rangeIndex - 2)] === '' ? ++count : count, 0) === 1;
    }

    _getCoordinatesToPreventUserWin() {
        try {
            // prevent horizontally win
            let x = this._board.findIndex(this._callbackRowWithTwoUserMovesAndWithFreeCell);
            let y = null;
            if (~x) {
                y = this._board[x].findIndex(cell => cell === '');
            } else {
                // prevent vertically win
                const range = this._getRange();

                y = range.findIndex((columnIndex) =>
                    this._board.reduce((count, row) =>
                        row[columnIndex] === USER_MOVE_SYMBOL ? ++count : count, 0) === 2
                    && this._board.reduce((count, row) =>
                        row[columnIndex] === '' ? ++count : count, 0) === 1);

                if (~y) {
                    x = this._board.findIndex(row => row[y] === '');
                } else {
                    // prevent main diagonal win
                    if (this._checkIsMainDiagonalWithTwoUserMovesAndWithFreeCell()) {
                        x = y = range.findIndex((columnIndex) => this._board[columnIndex][columnIndex] === '');
                    } else if (this._checkIsSecondaryDiagonalWithTwoUserMovesAndWithFreeCell()) {
                        // prevent secondary diagonal win
                        x = range.findIndex((columnIndex) => this._board[columnIndex][Math.abs(columnIndex - 2)] === '');
                        y = Math.abs(x - 2);
                    }
                }
            }

            if (x === -1 || x === null) {
                this._throwException('cannot find row where user will win')
            }

            if (y === -1 || y === null) {
                this._throwException('cannot find cell where user will win')
            }

            return [x, y];
        } catch (e) {
            console.warn('_getCoordinatesToPreventUserWin error->',e);
        }
    }

    _getRange() {
        return [...Array(this._fieldSize).keys()];
    }

    _getFreeRandomCoordinates() {
        let x = this._getRandomCoordinate();
        let y = this._getRandomCoordinate();

        while (!!this._board[x][y]) {
            x = this._getRandomCoordinate();
            y = this._getRandomCoordinate();
        }

        return [x, y];
    }

    _getFreeCellsCount() {
        return this._board.reduce((total, row) =>
            row.reduce((count, el) =>
                el === '' ? ++count : count, total), 0);
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

    _getRandomCoordinate() {
        return Math.floor(Math.random() * (this._fieldSize));
    }

    _throwException(msg) {
        throw new Error(msg);
    }
}