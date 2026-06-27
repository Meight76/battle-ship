import Player from './player-template.js';

export default class Bot extends Player {
    constructor() {
        /*
        parent class:
         -this.board = new Board()
         -this.pontuaction = 0
         attack(boardObj, coord)
         */
        super();
    }

    //random deploy all its five ships, or less, lacking deployment
    randomDeploy() {
        // it has to be a copy, because placeShip(mutate in process ships to deploy)
        // if it's not a copy it will skip elements
        const ships = this.board.shipsToDeploy.slice();

        for (const length of ships) {
            const mode = Math.random() > 0.5 ? 'v' : 'h';
            //calls board method to get valid indexes
            const validDeploy = this.board.getValidDeploy(length, mode);
            // choose randomly an index in range from array
            const randomInd = Math.floor(Math.random() * validDeploy.length);
            const coord = validDeploy[randomInd];
            // if coord === undefined that means all squares has been attacked
            // or there is a bug
            if (coord === undefined)
                throw new Error(`${coord} is not valid coord`);
            this.board.placeShip(length, coord, mode);
        }
    }

    randomAttack(boardObj) {
        // get valid attack indexes
        const validAtt = boardObj.getValidAttacks();
        if (validAtt.length === 0) throw new Error('no square left to attack');
        // get random index
        const randomInd = Math.floor(Math.random() * validAtt.length);
        const coord = validAtt[randomInd];
        this.attack(boardObj, coord);
    }
}
