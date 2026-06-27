import Ship from './ship-template.js';

export default class Square {
    #ship;
    #isHit;
    constructor() {
        this.#isHit = false;
        this.#ship = null;
    }

    set ship(shipObj) {
        if (!(shipObj instanceof Ship))
            throw new Error('cant point to a non-ship object');
        this.#ship = shipObj;
    }

    get ship() {
        return this.#ship;
    }

    get isHit() {
        return this.#isHit;
    }

    hit() {
        this.#isHit = true;
        if (this.#ship !== null) {
            this.#ship.hit();
            return true;
        }
        return false;
    }

    resetShip() {
        this.#ship = null;
    }

    resetHit() {
        this.#isHit = false;
    }
}
