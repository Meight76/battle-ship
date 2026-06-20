import Square from './board-square-template.js';
import Ship from './ship-template.js';

export default class GameBoard {
    #board = '';
    constructor() {
        // the number false means "no hit" true means "hit"
        // the board will only contain info about hits, not loc of ships
        this.#board = this.#initializeBoard();
    }

    // ten coluns fill with Square object (matrix)
    #initializeBoard() {
        return (this.#board = Array(10)
            .fill()
            .map(() => new Array(10).fill().map(() => new Square())));
    }

    #abortPlaceShip(touchedSquaresArr) {
        for (const sqr of touchedSquaresArr) {
            sqr.ship = null;
        }
    }

    // coord = [line, column] or [y, x]
    // axeMode = "v || V" for vertical and "h || H" for horizontal
    // h moves column, v moves line ([line, column])
    placeShip(shipLengh, coordArr, axeMode) {
        // check if ship is the correct object
        if (!shipLengh) throw new Error("can't deploy a ship with no length");
        // check if coord are valid
        if (!Array.isArray(coordArr) || coordArr.length !== 2)
            throw new Error('invalid coord for deploy');
        // declare coord variable
        const [y, x] = coordArr;
        // check if coords are in range
        if (x > 9 || x < 0 || y > 9 || y < 0)
            throw new Error('coords out of range');
        // check if mode is string
        if (typeof axeMode !== 'string')
            throw new Error('invalid axe provided');
        const shipObj = new Ship(shipLengh);
        const touchedSquares = [];

        // mark all the vertical with the reference to shipObj
        if (axeMode.charAt(0).toLowerCase() === 'v') {
            if (x + shipObj.length > 10)
                throw new Error('not enough space to fit vertically ship');
            for (let v = 0; v < shipObj.length; v++) {
                const boardSqr = this.#board[y + v][x];
                if (boardSqr.shipPointer !== null) {
                    this.#abortPlaceShip(touchedSquares);
                    throw new Error('space already contain ship');
                }
                boardSqr.shipPointer = shipObj;
                touchedSquares.push(boardSqr);
            }
            // mark all the horizontal with reference to shipObj
        } else if (axeMode.charAt(0).toLowerCase() === 'h') {
            if (y + shipObj.length > 10)
                throw new Error('not enough space to fit horizontally');
            for (let h = 0; h < shipObj.length; h++) {
                const boardSqr = this.#board[y][x + h];
                if (boardSqr.shipPointer !== null) {
                    this.#abortPlaceShip(touchedSquares);
                    throw new Error('space already contain ship');
                }
                boardSqr.shipPointer = shipObj;
                touchedSquares.push(boardSqr);
            }
            // invalid axe mode
        } else {
            throw new Error('axe mode is not provided');
        }
    }

    /* remember coords = [y, x] */
    receiveAttack(coordArr) {
        if (!Array.isArray(coordArr) || coordArr.length !== 2)
            throw new Error('invalid coord provided to receive attack');
        const [y, x] = coordArr;
        const square = this.#board[y][x];
        // call ship hit function to increase hit counter
        if (square.shipPointer instanceof Ship) square.shipPointer.hit();
        // call square hit function to declare it as hit
        square.hit();
    }

    /* debug && test purpose */
    getSquare(coordArr) {
        if (!Array.isArray(coordArr))
            throw new Error('invalid coord array to retrieve square');
        if (coordArr.length !== 2) throw new Error('invalid coord array index');
        const [y, x] = coordArr;

        return this.#board[y][x];
    }

    visualizeBoard() {
        for (const row of this.#board) {
            const replacedRow = row.map((val) => {
                if (val.shipPointer !== null) return 1;
                if (val.shipPointer === null) return 0;
            });
            console.log(replacedRow);
        }
    }
}
