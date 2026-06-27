import Player from './player-template.js';

export default class Bot extends Player {
    constructor() {
        super();
    }

    randomDeploy() {
        const ships = this.board.shipsToDeploy;

        for (const length of ships) {
            const mode = Math.random() > 0.5 ? 'v' : 'h';
            const validDeploy = this.board.getValidDeploy();
            const randomInd = Math.floor(Math.random() * validDeploy.length);
            const coord = validDeploy[randomInd];
            if (coord === undefined)
                throw new Error(`${coord} is not valid coord`);
            this.board.placeShip(length, coord, mode);
        }
    }

    randomAttack(boardObj) {
        const validAtt = this.board.getValidAttacks();
        if (!validAtt) throw new Error('no square left to attack');
        const randomInd = Math.floor(Math.random() * validAtt.length);
        const coord = validAtt[randomInd];
        this.attack(boardObj, coord);
    }
}
