import GameBoard from "../src/classes/game-board-template.js";
import Ship from "../src/classes/ship-template.js";

let gameBoard;

describe("test placement for ships", () => {
    beforeEach(() => {
        gameBoard = new GameBoard();
    })

    test("place ship", () => {
        gameBoard.placeShip(5, [1,2], "h");
        gameBoard.placeShip(4, [2, 4], "v");
        expect(gameBoard.getSquare([1,2]).shipPointer).toBeInstanceOf(Ship);
        expect(gameBoard.getSquare([1, 5]).shipPointer).toBeInstanceOf(Ship);
        expect(gameBoard.getSquare([4, 4]).shipPointer).toBeInstanceOf(Ship);
        expect(gameBoard.getSquare([2, 4]).shipPointer).toBeInstanceOf(Ship);
        expect(gameBoard.getSquare([3,4]).shipPointer).toBeInstanceOf(Ship);
    });
    test("don't place ship", () => {
        expect(gameBoard.getSquare([1,1]).shipPointer).not.toBeInstanceOf(Ship);
        expect(gameBoard.getSquare([1,6]).shipPointer).not.toBeInstanceOf(Ship);
    })
    test("not enough space", () => {
        expect(() => gameBoard.placeShip(5, [8, 8], "v")).toThrow();
        expect(() => {
            gameBoard.placeShip(2, [8,8], "v");
            gameBoard.placeShip(1, [8,8], "v");
    }).toThrow();
        expect(() => gameBoard.placeShip(2, [9, 9], "h")).toThrow();
        expect(() => gameBoard.placeShip(5,[7, 7],"v")).toThrow();
        expect(() => gameBoard.placeShip(3, [8, 9], "h")).toThrow();
    });
});
