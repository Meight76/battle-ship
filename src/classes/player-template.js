import GameBoard from './game-board-template.js';

export default class Player {
    constructor() {
        this.board = new GameBoard();
        this.pontuaction = 0;
    }
}
