import Player from "./player-template.js";

export default class Bot extends Player {
    constructor() {
        super();
        this.validAttack = this.#getArrayFilled(100);
    }

    #getArrayFilled(length) {
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(i);
        }
        return arr;
    }

    randomDeploy() {
        const ships = this.board.shipsToDeploy;

        for (const length of ships) {
            const mode = (Math.random() > 0.50) ? "v" : "h";
            const validDeploy = this.board.getValidDeploy();
            const randomInd = Math.floor(Math.random() * validDeploy.length);
            const coord = validDeploy[randomInd];
            if (coord === undefined) throw new Error(`${coord} is not valid coord`);
            this.board.placeShip(length, coord, mode);
        }
    }

    randomAttack() {
        const validAtt = this.board.getValidAttacks();
        if (!validAtt) throw new Error("no square left to attack");
        const randomInd = Math.floor(Math.random() * validAtt.length);
        const coord = validAtt[randomInd];
        this.attack(coord);
    }
}
