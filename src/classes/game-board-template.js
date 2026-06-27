import Square from './board-square-template.js';
import Ship from './ship-template.js';

export default class Board {
    /*
    declare private fields
     */
    #board;
    #ships;
    #missHits;
    #hits;
    /*
    initialize privateFields and two properties
    */
    constructor() {
        this.#board = this.#initializeBoard();
        this.shipsToDeploy = [2, 3, 3, 4, 5];
        this.#ships = [];
        this.#missHits = [];
        this.#hits = [];
    }

    /*
    a little bit more complex, but it says:
    create an array where each element of it
    will be another array containing 10 square Objects
    */
    #initializeBoard() {
        //the board of this class is equal to an array of length 10 filled with an array containing 10 square obj in each key
        return (this.#board = Array(10)
            .fill()
            .map(() => new Array(10).fill().map(() => new Square())));
    }

    /*
    if it occurs an error when deploying a ship
    it triggers this functions to reset all changes
    and game follow like nothing happened
    */
    #abortPlaceShip(touchedSquaresArr) {
        //call resetShip() function from square class to make ship point back to null
        for (const sqr of touchedSquaresArr) sqr.resetShip();
    }

    /*
    give it a ship length between 2 and 5
    a coord between 0 and 99
    mode like v for vertical and h for horizontal
    and it'll place your ship in the board in all its
    corresponding squares
    */
    placeShip(shipLength, coord, mode) {
        // check if you provided a valid length other wise it throws an error to warn you
        if (!(this.shipsToDeploy.includes(shipLength)))
            throw new Error(`${shipLength} is not a valid ship length`);
        //check if you provided a valid coord other wise it throws an error to warn you
        if (!(Number.isInteger(coord)) || coord < 0 || coord > 99)
            throw new Error(`${coord} is not a valid coord`);
        //check if you provided a valid mode otherwise it throws an error to warn you
        if (mode !== 'v' && mode !== 'h')
            throw new Error(`${mode} is not a valid mode`);
        const y = Math.floor(coord / 10);
        const x = coord % 10;
        const ship = new Ship(shipLength);
        /*stores in memory all square that's been modified
        in case of error, it can comeback to these and reset them
        */
        const touchedSqr = [];

        if (mode === 'v') {
            //it throws an error if you try pass a ship that can't fit in the coord provided by you
            if (y + shipLength > 9)
                throw new Error(`cant fit y:${y} shipLength:${shipLength}`);
            //iterates through lines to place ship vertically
            for (let v = 0; v < shipLength; v++) {
                const sqr = this.#board[y + v][x];
                //if already contains a ship you abort and reset all sqr from this ship and then throw error
                if (sqr.ship !== null) {
                    this.#abortPlaceShip(touchedSqr);
                    throw new Error(`${y + v},${x} already contain ship`);
                }
                sqr.ship = ship;
                //record this current sqr modified in the list declared above in case of error later
                touchedSqr.push(sqr);
            }
            return;
        }
        if (mode === 'h') {
            //it throws an error if you try to fit a length in coord that doesn't fit
            if (x + shipLength > 9)
                throw new Error(`cant fit x:${x} shipLength:${shipLength}`);
            //iterates through columns
            for (let h = 0; h < shipLength; h++) {
                const sqr = this.#board[y][x + h];
                if (sqr.ship !== null) {
                    this.#abortPlaceShip(touchedSqr);
                    throw new Error(`${y},${x + h} already contain ship`);
                }
                sqr.ship = ship;
                //record touched square in case of later error
                touchedSqr.push(sqr);
            }
        }
        //after placing a ship, this means "all went just fine (hopefully!)", you record its reference in memory
        this.#ships.push(ship);
        // retrieve array index from shipsToDeploy that contains shipLength, in order to, delete after use
        this.shipsToDeploy.splice(
            this.shipsToDeploy.findIndex((len) => len === shipLength),
            1
        );
    }
    // it takes a coord and attack it's corresponding square in memory
    receiveAttack(coord) {
        // if you didn't provided integer, or coord are not in between 0..99 throw error to warn you
        if (!(Number.isInteger(coord)) || coord < 0 || coord > 99)
            throw new Error(`${coord} is not valid coord`);
        const y = Math.floor(coord / 10);
        const x = coord % 10;
        const sqr = this.#board[y][x];
        // if sqr is already hit you surely made a mistake and it throws an error
        if (sqr.isHit) throw new Error(`${y},${x} is already hit`);
        // call square hit function that return: false if not hit ship, or, true if hit a ship
        const isShip = sqr.hit();
        if (isShip) this.#hits.push(coord);
        if (!isShip) this.#missHits.push(coord);
    }

    get sucessHits() {
        return this.#hits;
    }

    get missedHits() {
        return this.#missHits;
    }

    get ships() {
        return this.#ships;
    }

    // return true if all ships sunk, or false if not
    isAllSunk() {
        for (const s of this.#ships) {
            // if i'm storing ships as object, each object should be able to tell itself if it's sunk
            if (!s.isSunk()) return false;
        }
        return true;
    }

    // reset essential priorities to initial value
    resetBoard() {
        this.#board = this.#initializeBoard();
        this.#ships = [];
        this.#hits = [];
        this.#missHits = [];
        this.shipsToDeploy = [2, 3, 3, 4, 5];
    }

    // return the square object from the coord provided
    getSquare(coord) {
        if (!Number.isInteger(coord) || coord < 0 || coord > 99)
            throw new Error(`${coord} is not a valid coord`);
        const y = Math.floor(coord / 10);
        const x = coord % 10;
        return this.#board[y][x];
    }

    getValidDeploy(length, mode) {
        if (!(Number.isInteger(length)) || !(this.shipsToDeploy.includes(length)))
            throw new Error(`${length} is not valid length`);
        if (mode !== 'v' && mode !== 'h')
            throw new Error(`${mode} is not a valid mode`);
        // create an array to store all board indexes that are returned as true by function
        const validInd = [];
        // iterate through all square in board
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                if (this.#checkCoordAHead(y * 10 + x, mode, length))
                    validInd.push(y * 10 + x);
            }
        }
        return validInd;
    }

    getValidAttacks() {
        // create an array to store all valid indexes that are returned as true by condition
        const valid = [];
        // iterate through all squares in board
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const sqr = this.getSquare(y * 10 + x);
                if (sqr !== undefined && !sqr.isHit) valid.push(y * 10 + x);
            }
        }
        return valid;
    }
    // calculate indexes provided by mode and coord (first coord) and check if they're all valid for deployment
    #checkCoordAHead(coord, mode, length) {
        const y = Math.floor(coord / 10);
        const x = coord % 10;
        if (mode === 'v') {
            if (y + length > 9) return false;
            for (let v = 0; v < length; v++) {
                let sqr;
                // in case getSquare return an error it'll automatically means invalid or a mistake made by me kkk
                try {
                    sqr = this.getSquare((y + v) * 10 + x);
                } catch (e) {
                    console.log(e.name);
                    console.log(e.message);
                    return false;
                }
                // if getSquare return undefined is probably out of index range
                if (sqr === undefined) return false;
                if (sqr.ship !== null) return false;
            }
            return true;
        }
        if (mode === 'h') {
            // check if you can fit horizontally a ship in board, or it doesn't fit
            if (x + length > 9) return false;
            // iterate through columns
            for (let h = 0; h < length; h++) {
                let sqr;
                try {
                    sqr = this.getSquare(y * 10 + x + h);
                } catch (e) {
                    console.log(e.name);
                    console.log(e.message);
                    return false;
                }
                if (sqr === undefined) return false;
                if (sqr.ship !== null) return false;
            }
            return true;
        }
    }

    // this function ain't that useful, it's purely for debug, otherwise i can find another use for it, which i cant
    visualizeConsoleBoard() {
        // swap all non-ship squares by 0
        // swap all ships squares by 1
        // print them
        for (const row of this.#board) {
            const replacedRow = row.map((val) => {
                if (val.ship !== null) return 1;
                return 0;
            });
            console.log(replacedRow);
        }
    }
}
