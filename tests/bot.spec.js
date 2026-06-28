import Bot from '../src/classes/bot-template.js';
import Board from '../src/classes/game-board-template.js';

let bot = new Bot();
let board = new Board();

describe('random attack', () => {
    beforeEach(() => {
        bot = new Bot();
        board = bot.board;
    });

    test('attack five times itself', () => {
        bot.randomAttack(board);
        bot.randomAttack(board);
        bot.randomAttack(board);
        bot.randomAttack(board);
        bot.randomAttack(board);
        expect(board.missedHits.length).toBe(5);
    });
});

describe('random deploy', () => {
    beforeEach(() => {
        bot = new Bot();
        board = bot.board;
    });

    test('deploy its five ships', () => {
        bot.randomDeploy();
        expect(board.ships.length).toBe(5);
    });
});
