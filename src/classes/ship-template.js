export default class Ship {
    #len = '';
    #numHits = '';

    constructor(length) {
        this.#len = length;
        this.#numHits = 0;
    }

    hit() {
        this.#numHits++;
    }

    get length() {
        return this.#len;
    }

    get timesHit() {
        return this.#numHits;
    }

    get isSunk() {
        if (this.#numHits === this.#len) return true;
        return false;
    }
}
