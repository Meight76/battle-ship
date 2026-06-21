import Ship from './ship-template.js';

export default class Square {
    #ship = '';
    #isHit = '';
    constructor() {
        this.#ship = null;
        this.#isHit = false;
    }

    set shipPointer(shipObj) {
        if (!(shipObj instanceof Ship))
            throw new Error("can't point to a non-ship object");
        this.#ship = shipObj;
    }

    get shipPointer() {
        return this.#ship;
    }

    resetShip() {
        this.#ship = null;
    }

    get isHit() {
        return this.#isHit;
    }

    hit() {
        this.#isHit = true;
    }

    resetHit() {
        this.#isHit = false;
    }
}
