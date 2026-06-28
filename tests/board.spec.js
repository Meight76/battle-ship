import Board from '../src/classes/game-board-template.js';
import Ship from '../src/classes/ship-template.js';
let board = new Board();

describe('place ships', () => {
    beforeEach(() => {
        board = new Board();
    });

    test('correctly identifies one ship in board', () => {
        board.placeShip(5, 0, 'h');
        expect(board.getSquare(0).ship).toBeInstanceOf(Ship);
        expect(board.ships.length).toBe(1);
        expect(board.getSquare(0).ship.length).toBe(5);
    });

    test('correctly identifies five ships in board', () => {
        board.placeShip(2, 10, 'h');
        board.placeShip(3, 15, 'h');
        board.placeShip(3, 40, 'v');
        board.placeShip(4, 42, 'v');
        board.placeShip(5, 63, 'h');
        expect(board.getSquare(10).ship).toBeInstanceOf(Ship);
        expect(board.getSquare(10).ship.length).toBe(2);
        expect(board.getSquare(15).ship).toBeInstanceOf(Ship);
        expect(board.getSquare(15).ship.length).toBe(3);
        expect(board.getSquare(40).ship).toBeInstanceOf(Ship);
        expect(board.getSquare(40).ship.length).toBe(3);
        expect(board.getSquare(42).ship).toBeInstanceOf(Ship);
        expect(board.getSquare(42).ship.length).toBe(4);
        expect(board.getSquare(63).ship).toBeInstanceOf(Ship);
        expect(board.getSquare(63).ship.length).toBe(5);
        expect(board.ships.length).toBe(5);
    });

    test('throw error for invalid placements', () => {
        expect(() => board.placeShip(5, 100, 'h')).toThrow();
        expect(() => board.placeShip(3, 88, 'v')).toThrow();
        expect(() => board.placeShip(6, 80, 'h')).toThrow();
        expect(() => board.placeShip(4, 76.5, 'h')).toThrow();
        expect(() => board.placeShip(2.5, 55, 'h')).toThrow();
        expect(() => board.placeShip(2, 60, 'w')).toThrow();
        expect(board.shipsToDeploy.length).toBe(5);
        expect(board.ships.length).toBe(0);
    });
});

describe('attack board', () => {
    beforeEach(() => (board = new Board()));

    test('correctly attack one non-ship square', () => {
        board.receiveAttack(0);
        expect(board.getSquare(0).isHit).toBeTruthy();
        expect(board.missedHits.length).toBe(1);
    });
    test('correctly attack multiple ships and non-ships squares', () => {
        board.placeShip(2, 60, 'h');
        board.placeShip(4, 46, 'h');
        board.placeShip(3, 30, 'v');
        board.placeShip(5, 80, 'h');
        board.placeShip(3, 56, 'h');

        expect(board.ships.length).toBe(5);
        expect(board.missedHits.length).toBe(0);
        expect(board.sucessHits.length).toBe(0);

        board.receiveAttack(60);
        expect(board.getSquare(60).isHit).toBeTruthy();
        expect(board.getSquare(60).ship.timesHit).toBe(1);
        expect(board.sucessHits.length).toBe(1);

        board.receiveAttack(50);
        expect(board.getSquare(50).isHit).toBeTruthy();
        expect(board.getSquare(50).ship.timesHit).toBe(1);
        expect(board.sucessHits.length).toBe(2);

        board.receiveAttack(90);
        expect(board.getSquare(90).isHit).toBeTruthy();
        expect(board.getSquare(90).ship === null).toBeTruthy();
        expect(board.missedHits.length).toBe(1);
        expect(board.sucessHits.length).toBe(2);
    });

    test('correctly throw errors', () => {
        expect(() => board.receiveAttack(100)).toThrow();
        expect(() => board.receiveAttack(9.5)).toThrow();
        expect(() => board.receiveAttack('a')).toThrow();
        expect(() => {
            board.receiveAttack(0);
            board.receiveAttack(0);
        }).toThrow();
        expect(board.missedHits.length).toBe(1);
        expect(board.sucessHits.length).toBe(0);
    });
});

describe('is all sunk', () => {
    beforeEach(() => (board = new Board()));

    test('board is empty', () => {
        expect(board.isAllSunk()).toBeTruthy();
    });

    test('board has one non-sunk ship', () => {
        board.placeShip(5, 40, 'h');
        expect(board.isAllSunk()).not.toBeTruthy();
    });

    test('board has one sunk ship', () => {
        board.placeShip(2, 0, 'h');
        board.receiveAttack(0);
        board.receiveAttack(1);
        expect(board.getSquare(0).ship.timesHit).toBe(2);
        expect(board.isAllSunk()).toBeTruthy();
        expect(board.sucessHits.length).toBe(2);
    });

    test('board has two sunk ship', () => {
        board.placeShip(2, 0, 'h');
        board.placeShip(3, 10, 'v');
        board.receiveAttack(0);
        board.receiveAttack(1);
        board.receiveAttack(10);
        board.receiveAttack(20);
        board.receiveAttack(30);

        expect(board.getSquare(0).ship.timesHit).toBe(2);
        expect(board.getSquare(10).ship.timesHit).toBe(3);
        expect(board.sucessHits.length).toBe(5);
        expect(board.missedHits.length).toBe(0);
        expect(board.isAllSunk()).toBeTruthy();
    });

    test('board has one ship sunk and one non-sunk ship', () => {
        board.placeShip(2, 0, 'h');
        board.placeShip(3, 10, 'v');
        board.receiveAttack(0);
        board.receiveAttack(1);
        expect(board.getSquare(10).isHit).not.toBeTruthy();
        expect(board.getSquare(10).ship.timesHit).toBe(0);
        expect(board.getSquare(0).isHit).toBeTruthy();
        expect(board.getSquare(0).ship.timesHit).toBe(2);
        expect(board.missedHits.length).toBe(0);
        expect(board.sucessHits.length).toBe(2);
        expect(board.isAllSunk()).not.toBeTruthy();
    });
});

describe('valid deploy', () => {
    beforeEach(() => (board = new Board()));

    test('empty board', () => {
        expect(board.getValidDeploy(5, 'h').length).toBe(60);
        expect(board.getValidDeploy(4, 'h').length).toBe(70);
        expect(board.getValidDeploy(3, 'h').length).toBe(80);
        expect(board.getValidDeploy(2, 'h').length).toBe(90);
        expect(board.getValidDeploy(5, 'v').length).toBe(60);
        expect(board.getValidDeploy(4, 'v').length).toBe(70);
        expect(board.getValidDeploy(3, 'v').length).toBe(80);
        expect(board.getValidDeploy(2, 'v').length).toBe(90);
    });

    test('board contain three ships', () => {
        board.placeShip(4, 81, 'h');
        board.placeShip(3, 42, 'v');
        board.placeShip(2, 60, 'h');
        expect(board.getValidDeploy(5, 'h').length).toBe(46);
        expect(board.getValidDeploy(4, 'h').length).toBe(56);
        expect(board.getValidDeploy(3, 'h').length).toBe(66);
        expect(board.getValidDeploy(2, 'h').length).toBe(78);
        expect(board.getValidDeploy(5, 'v').length).toBe(42);
        expect(board.getValidDeploy(4, 'v').length).toBe(52);
        expect(board.getValidDeploy(3, 'v').length).toBe(63);
        expect(board.getValidDeploy(2, 'v').length).toBe(74);
    });

    test('correctly throws errors', () => {
        expect(() => board.getValidDeploy(10.5, 'v')).toThrow();
        expect(() => board.getValidDeploy('a', 'h')).toThrow();
        expect(() => board.getValidDeploy(5, 'a')).toThrow();
        expect(() => board.getValidDeploy(5, 50)).toThrow();
    });
});

describe('valid Attacks', () => {
    beforeEach(() => (board = new Board()));

    test('empty board', () => {
        expect(board.getValidAttacks().length).toBe(100);
    });

    test('board contains three ships', () => {
        board.placeShip(5, 40, 'h');
        board.placeShip(3, 70, 'v');
        board.placeShip(2, 0, 'v');
        expect(board.getValidAttacks().length).toBe(100);
    });

    test('board received three attacks', () => {
        board.receiveAttack(0);
        board.receiveAttack(10);
        board.receiveAttack(76);
        expect(board.getValidAttacks().length).toBe(97);
    });

    test('board received three missed attacks and has three ships attacked', () => {
        board.receiveAttack(0);
        board.receiveAttack(11);
        board.receiveAttack(20);
        board.placeShip(5, 10, 'h');
        board.placeShip(4, 60, 'v');
        board.placeShip(3, 61, 'h');
        board.receiveAttack(10);
        board.receiveAttack(60);
        board.receiveAttack(61);
        expect(board.getValidAttacks().length).toBe(94);
    });
});
