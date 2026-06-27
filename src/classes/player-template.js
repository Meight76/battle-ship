import Board from './game-board-template.js';

export default class Player {
    constructor() {
        this.board = new Board();
        this.pontuaction = 0;
        this.attackCount = 0;
    }

    attack(boardObj, coord) {
        boardObj.receiveAttack(coord);
        console.log(++this.attackCount);
    }
}
