import Square from '../src/classes/board-square-template.js';
import Ship from '../src/classes/ship-template.js';

let sqr = new Square();

describe('hit update states correctly', () => {
    beforeEach(() => (sqr = new Square()));

    test('hit no ship', () => {
        sqr.hit();
        expect(sqr.hit).toBeTruthy();
        expect(sqr.ship).toBeNull();
    });
    test('hit contain ship', () => {
        sqr.ship = new Ship(3);
        sqr.hit();
        expect(sqr.isHit).toBeTruthy();
        expect(sqr.ship.timesHit).toBe(1);
    });
    test('reset hit and ship', () => {
        sqr.ship = new Ship(3);
        sqr.hit();
        expect(sqr.isHit).toBeTruthy();
        expect(sqr.ship.timesHit).toBe(1);
        sqr.resetHit();
        sqr.resetShip();
        expect(sqr.isHit).not.toBeTruthy();
        expect(sqr.ship).toBeNull();
    });
});
