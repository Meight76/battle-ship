import Square from './board-square-template.js';
import Ship from './ship-template.js';

export default class GameBoard {
    #board = '';
    #ships = '';
    #attacks = '';
    constructor() {
        this.#ships = [];
        this.#attacks = [];
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
            sqr.resetShip();
        }
    }

    // coord = [line, column] or [y, x]
    // axeMode = "v || V" for vertical and "h || H" for horizontal
    // h moves column, v moves line ([line, column])
    placeShip(shipLength, coordArr, axeMode) {
        // check if ship is the correct object
        if (!shipLength) throw new Error("can't deploy a ship with no length");
        if (
            !Number.isInteger(shipLength) ||
            !(shipLength > 0 && shipLength < 6)
        )
            throw new Error('Invalid ship length');
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
        const shipObj = new Ship(shipLength);
        const touchedSquares = [];
        const newShipCoord = [];

        // mark all the vertical with the reference to shipObj
        if (axeMode.charAt(0).toLowerCase() === 'v') {
            if (y + shipObj.length > 10)
                throw new Error('not enough space to fit vertically ship');
            for (let v = 0; v < shipObj.length; v++) {
                const boardSqr = this.#board[y + v][x];
                if (boardSqr.shipPointer !== null) {
                    this.#abortPlaceShip(touchedSquares);
                    throw new Error('space already contain ship');
                }
                boardSqr.shipPointer = shipObj;
                newShipCoord.push([y + v, x]);
                touchedSquares.push(boardSqr);
            }
            // mark all the horizontal with reference to shipObj
        } else if (axeMode.charAt(0).toLowerCase() === 'h') {
            if (x + shipObj.length > 10)
                throw new Error('not enough space to fit horizontally');
            for (let h = 0; h < shipObj.length; h++) {
                const boardSqr = this.#board[y][x + h];
                if (boardSqr.shipPointer !== null) {
                    this.#abortPlaceShip(touchedSquares);
                    throw new Error('space already contain ship');
                }
                boardSqr.shipPointer = shipObj;
                newShipCoord.push([y, x + h]);
                touchedSquares.push(boardSqr);
            }
            // invalid axe mode
        } else {
            throw new Error('axe mode is not provided');
        }
        if (newShipCoord.length !== 0) this.#ships.push(newShipCoord);
    }

    /* remember coords = [y, x] */
    receiveAttack(coordArr) {
        if (!Array.isArray(coordArr) || coordArr.length !== 2)
            throw new Error('invalid coord provided to receive attack');
        const [y, x] = coordArr;
        if (!Number.isInteger(y) || !Number.isInteger(x))
            throw new Error('coords must be integers');
        if (y > 10 || y < 0 || x > 10 || x < 0)
            throw new Error('index out of range to receive attack');
        const square = this.#board[y][x];
        if (square.isHit)
            throw new Error('cannot attack the same square more than once');
        // call ship hit function to increase hit counter
        if (square.shipPointer instanceof Ship) {
            square.shipPointer.hit();
        }
        // call square hit function to declare it as hit
        this.#attacks.push(coordArr);
        square.hit();
    }

    /*
    return an array of arrays containing each coordArr
    Array 3d, an array containing arrays that group coordArr
    the coords are grouped by ship reference
    */
    searchAllShipCoord() {
        const shipsCoord = [];

        /* iterate through all squares looking for one that points to a ship*/
        for (let line = 0; line <= 9; line++) {
            for (let column = 0; column <= 9; column++) {
                const sqr = this.#board[line][column];
                // if it doesn't point to ship continue
                if (!(sqr.shipPointer instanceof Ship)) continue;
                // declare variable to keep track of any occurence already in the array
                let isShipRef = false;

                /* search for any occurence in shipsCoord
                   if found any you just push coord into it
                   and flag isShipRef with true */
                shipsCoord.map((cArr) => {
                    if (
                        this.getSquare(cArr[0]).shipPointer === sqr.shipPointer
                    ) {
                        cArr.push([line, column]);
                        isShipRef = true;
                    }
                });
                /* if it's not found any occurence then it can only be
                   the first one and must be pushed directly into array */
                if (!isShipRef) {
                    shipsCoord.push([[line, column]]);
                }
            }
        }
        this.#ships = shipsCoord;
        return shipsCoord;
    }

    /* return array of array of all squares coords*/
    searchAllHits() {
        const hit = [];
        for (let line = 0; line <= 9; line++) {
            for (let column = 0; column <= 9; column++) {
                const square = this.#board[line][column];
                if (square.isHit) hit.push([line, column]);
            }
        }
        this.#attacks = hit;
        return hit;
    }

    getHits() {
        return this.#attacks;
    }

    getShips() {
        return this.#ships;
    }

    getMissedAttacks() {
        const missed = [];
        /* #attacks = [[],[],[]] array 2d containg all coord that received attack */
        for (const c of this.#attacks) {
            const sqr = this.getSquare(c);
            if (sqr.shipPointer) continue;
            missed.push(c);
        }
        return missed;
    }

    /*loop through all group of ship Coord get data from them, check if they sunk
    if the number of ships and number of sunks are the same then return true else false */
    isAllSunk() {
        /* s = [[],[],[]] array 2d, containg all the coords that reference that ship*/
        const ships = this.#ships;
        const howManyShips = ships.length;
        let sunkCount = 0;
        for (const s of ships) {
            const shipLength = s.length;
            const manyHits = this.getSquare(s[0]).shipPointer.timesHit;
            if (manyHits === shipLength) sunkCount++;
        }
        if (sunkCount === howManyShips) return true;
        return false;
    }

    getSquare(coordArr) {
        if (!Array.isArray(coordArr))
            throw new Error('invalid coord array to retrieve square');
        if (coordArr.length !== 2) throw new Error('invalid coord array index');
        const [y, x] = coordArr;

        return this.#board[y][x];
    }

    /* debug && test purpose */

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
