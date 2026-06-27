import Square from "./board-square-template.js";
import Ship from "./ship-template.js";

export default class Board {
    #board;
    #ships;
    #missHits;
    #hits;
    constructor() {
        this.#board = this.#initializeBoard();
        this.shipsToDeploy = [2, 3, 3, 4, 5];
        this.#ships = [];
        this.#missHits = [];
        this.hits = [];
    }

    #initializeBoard() {
        return (this.#board = Array(10)
            .fill()
            .map(() => new Array(10).fill().map(() => new Square())));
    }

    #abortPlaceShip(touchedSquaresArr) {
        for (const sqr of touchedSquaresArr) sqr.resetShip();
    }

    placeShip(shipLength, coord, mode) {
        if (!(this.shipsToDeploy.includes(shipLength))) throw new Error(`${shipLength} is not a valid ship length`);
        if (!(Number.isInteger(coord)) || coord < 0 || coord > 99) throw new Error(`${coord} is not a valid coord`);
        if (!(mode !== "v" && mode !== "h")) throw new Error(`${mode} is not a valid mode`);
        const y = Math.floor(coord / 10);
        const x = coord % 10;
        const ship = new Ship(shipLength);
        const touchedSqr = [];

        if (mode === "v") {
            if (y + shipLength > 9) throw new Error(`cant fit y:${y} shipLength:${shipLength}`);
            for (let v = 0; v < shipLength; v++) {
                const sqr = this.#board[y + v][x];
                if (sqr.shipPointer !== null) {
                    this.#abortPlaceShip(touchedSqr);
                    throw new Error(`${y + v},${x} already contain ship`);
                }
                sqr.shipPointer = ship;
                touchedSqr.push(sqr);
            }
            return;
        }
        if (mode === "h") {
            if (x + shipLength > 9) throw new Error(`cant fit x:${x} shipLength:${shipLength}`);
            for (let h = 0; h < shipLength; h++) {
                const sqr = this.#board[y][x + h];
                if (sqr.shipPointer !== null) {
                    this.#abortPlaceShip(touchedSqr);
                    throw new Error(`${y},${x + h} already contain ship`);
                }
                sqr.shipPointer = ship;
                touchedSqr.push(sqr);
            }
        }
        this.#ships.push(ship);
    }

    receiveAttack(coord) {
        if (!(Number.isInteger(coord)) || coord < 0 || coord > 99) throw new Error(`${coord} is not valid coord`);
        const y = Math.floor(coord / 10);
        const x = coord % 10;
        const sqr = this.#board[y][x];
        if (sqr.isHit) throw new Error(`${y},${x} is already hit`);
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

    isAllSunk() {
        for (const s of this.#ships) {
            if (!(s.isSunk())) return false
        }
        return true;
    }

    resetBoard() {
        this.#board = this.#initializeBoard();
        this.#ships = [];
        this.#hits = [];
        this.#missHits = [];
        this.shipsToDeploy = [2, 3, 3, 4, 5];
    }

    getSquare(coord) {
        if (!(Number.isInteger(coord)) || coord < 0 || coord > 99) throw new Error(`${coord} is not a valid coord`);
        const y = Math.floor(coord / 10);
        const x = coord % 10;
        return this.#board[y][x];
    }

    visualizeConsoleBoard() {
        for (const row of this.#board) {
            const replacedRow = row.map(val => {
                if (val.shipPointer !== null) return 1;
                return 0;
            });
            console.log(replacedRow);
        }
    }
}
