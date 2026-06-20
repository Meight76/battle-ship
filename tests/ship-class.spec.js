import Ship from '../src/classes/ship-template.js';

let ship;

describe('test hit() and isSunk()', () => {
    beforeEach(() => {
        ship = new Ship(5);
    });
    test('hit one time', () => {
        expect(ship.timesHit).toBe(0);
        ship.hit();
        expect(ship.timesHit).toBe(1);
    });
    test('sunk ship', () => {
        expect(ship.isSunk).not.toBeTruthy();
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk).toBeTruthy();
    });
});
