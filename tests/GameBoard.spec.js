import GameBoard from '../src/classes/game-board-template.js';
import Ship from '../src/classes/ship-template.js';

let gameBoard;

describe('test placement for ships', () => {
    beforeEach(() => {
        gameBoard = new GameBoard();
    });

    test('place ship', () => {
        gameBoard.placeShip(5, [1, 2], 'h');
        gameBoard.placeShip(4, [2, 4], 'v');
        expect(gameBoard.getSquare([1, 2]).shipPointer).toBeInstanceOf(Ship);
        expect(gameBoard.getSquare([1, 5]).shipPointer).toBeInstanceOf(Ship);
        expect(gameBoard.getSquare([4, 4]).shipPointer).toBeInstanceOf(Ship);
        expect(gameBoard.getSquare([2, 4]).shipPointer).toBeInstanceOf(Ship);
        expect(gameBoard.getSquare([3, 4]).shipPointer).toBeInstanceOf(Ship);
    });

    test("don't place ship", () => {
        expect(gameBoard.getSquare([1, 1]).shipPointer).not.toBeInstanceOf(
            Ship
        );
        expect(gameBoard.getSquare([1, 6]).shipPointer).not.toBeInstanceOf(
            Ship
        );
    });

    test('not enough space', () => {
        expect(() => gameBoard.placeShip(5, [8, 8], 'v')).toThrow();
        expect(() => {
            gameBoard.placeShip(2, [8, 8], 'v');
            gameBoard.placeShip(1, [8, 8], 'v');
        }).toThrow();
        expect(() => gameBoard.placeShip(2, [9, 9], 'h')).toThrow();
        expect(() => gameBoard.placeShip(5, [7, 7], 'v')).toThrow();
        expect(() => gameBoard.placeShip(3, [8, 9], 'h')).toThrow();
    });

    test('abort ship placement', () => {
        expect(() => {
            gameBoard.placeShip(3, [4, 5], 'h');
            gameBoard.placeShip(2, [3, 5], 'v');
            gameBoard.placeShip(5, [4, 3], 'h');
        }).toThrow();

        const expected = [
            [
                "4,5",
                "4,6",
                "4,7"
            ],
        ];
        expect(gameBoard.getShips().length).toBe(1);
        expect(gameBoard.getShips().sort()).toEqual([...expected].sort());
    });
});

describe('test receive attack', () => {
    beforeEach(() => {
        gameBoard = new GameBoard();
    });

    test('mark square as damage correctly', () => {
        gameBoard.receiveAttack([1, 2]);
        gameBoard.receiveAttack([8, 9]);
        expect(gameBoard.getSquare([1, 2]).isHit).toBeTruthy();
        expect(gameBoard.getSquare([8, 9]).isHit).toBeTruthy();
    });

    test('ship detect and count hit correctly', () => {
        gameBoard.placeShip(5, [2, 3], 'v');
        gameBoard.receiveAttack([2, 3]);

        expect(gameBoard.getSquare([2, 3]).shipPointer.timesHit).toBe(1);

        gameBoard.receiveAttack([3, 3]);

        expect(gameBoard.getSquare([3, 3]).shipPointer.timesHit).toBe(2);

        gameBoard.receiveAttack([4, 3]);

        expect(gameBoard.getSquare([4, 3]).shipPointer.timesHit).toBe(3);

        gameBoard.receiveAttack([6, 3]);

        expect(gameBoard.getSquare([6, 3]).shipPointer.timesHit).toBe(4);
    });

    test('detect when no hit correctly', () => {
        gameBoard.placeShip(5, [2, 3], 'h');
        for (let i = 0; i < 9; i++) {
            for (let y = 0; y < 9; y++) {
                expect(gameBoard.getSquare([i, y]).isHit).not.toBeTruthy();
            }
        }
    });

    test('get all ship occupied squares', () => {
        gameBoard.placeShip(5, [2, 3], 'h');
        gameBoard.placeShip(2, [8, 8], 'v');
        gameBoard.placeShip(4, [4, 4], 'h');
        const shipCoord = gameBoard.getShips();
        expect(shipCoord.length).toBe(3);
        expect(shipCoord.sort()).toEqual(
            [
                [
                    "2,3",
                    "2,4",
                    "2,5",
                    "2,6",
                    "2,7"
                ],
                [
                    "8,8",
                    "9,8"
                ],
                [
                    "4,4",
                    "4,5",
                    "4,6",
                    "4,7"
                ],
            ].sort()
        );
    });

    test('attack same square two times', () => {
        gameBoard.placeShip(3, [1, 1], 'v');
        gameBoard.receiveAttack([1, 1]);
        expect(() => gameBoard.receiveAttack([1, 1])).toThrow();
        expect(gameBoard.getSquare([1, 1]).shipPointer.timesHit).toBe(1);
    });

    test('missed attacks', () => {
        gameBoard.placeShip(3, [1, 1], 'v');
        gameBoard.receiveAttack([1, 9]);
        expect(gameBoard.getMissedAttacks().length).toBe(1);
        gameBoard.receiveAttack([2, 3]);
        expect(gameBoard.getMissedAttacks().length).toBe(2);
        gameBoard.receiveAttack([2, 4]);
        expect(gameBoard.getMissedAttacks().length).toBe(3);

        const expected = [
            "1,9",
            "2,3",
            "2,4"
        ];
        expect(gameBoard.getMissedAttacks().sort()).toEqual(
            [...expected].sort()
        );
    });

    test('attack invalid index', () => {
        expect(() => gameBoard.receiveAttack([-1, -1])).toThrow(
            'index out of range to receive attack'
        );
        expect(() => gameBoard.receiveAttack([0.5, 0.3])).toThrow(
            'coords must be integers'
        );
        expect(() => gameBoard.receiveAttack(['s', 'c'])).toThrow(
            'coords must be integers'
        );
    });

    test('get all hit squares', () => {
        gameBoard.receiveAttack([1, 1]);
        gameBoard.receiveAttack([1, 4]);
        gameBoard.receiveAttack([7, 8]);
        const received = gameBoard.getHits();
        const expected = [
            "1,1",
            "1,4",
            "7,8"
        ];
        expect([...received].sort()).toEqual([...expected].sort());
    });

    test('is all sunk', () => {
        gameBoard.placeShip(3, [4, 5], 'h');
        gameBoard.placeShip(2, [2, 1], 'v');

        gameBoard.receiveAttack([4, 5]);
        gameBoard.receiveAttack([4, 6]);
        gameBoard.receiveAttack([4, 7]);
        gameBoard.receiveAttack([2, 1]);
        expect(gameBoard.isAllSunk()).not.toBeTruthy();
        gameBoard.receiveAttack([3, 1]);
        expect(gameBoard.isAllSunk()).toBeTruthy();
    });
});
