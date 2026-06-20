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
        const shipCoord = gameBoard.getAllShipCoord();
        expect(shipCoord.length).toBe(3);
        expect(shipCoord.sort()).toEqual(
            [
                [
                    [2, 3],
                    [2, 4],
                    [2, 5],
                    [2, 6],
                    [2, 7],
                ],
                [
                    [8, 8],
                    [9, 8],
                ],
                [
                    [4, 4],
                    [4, 5],
                    [4, 6],
                    [4, 7],
                ],
            ].sort()
        );
    });

    test('get all hit squares', () => {
        gameBoard.receiveAttack([1,1]);
        gameBoard.receiveAttack([1,4]);
        gameBoard.receiveAttack([7,8]);
        const received = gameBoard.getAllHit();
        const expected = [
            [1,1],
            [1,4],
            [7,8],
        ];
        expect([...received].sort()).toEqual([...expected].sort());
    })
});
