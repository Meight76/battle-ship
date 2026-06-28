import Ship from '../src/classes/ship-template.js';

let ship = new Ship();

describe('hit functions apply state correctly', () => {
    beforeEach(() => (ship = new Ship(3)));

    test('timesHit', () => {
        expect(ship.timesHit).toBe(0);
        ship.hit();
        expect(ship.timesHit).toBe(1);
        ship.hit();
        expect(ship.timesHit).toBe(2);
    });

    test('length', () => {
        expect(ship.length).toBe(3);
    });

    test('isSunk', () => {
        expect(ship.isSunk).not.toBeTruthy();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk).toBeTruthy();
        expect(ship.timesHit).toBe(3);
    });
});
