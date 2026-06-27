import GameBoard from "./game-board-template.js";

export default class Bot {
    constructor() {
        this.pontuaction = 0;
        this.board = new GameBoard()
        this.shipsLength = [2, 3, 4, 5, 7]
        this.validAttack = Array.from(Array(100).keys());
        this.validDeploy = Array.from(Array(100).keys());
    }

    restart() {
        this.validAttack = Array.from(Array(100).keys());
        this.validDeploy = Array.from(Array(100).keys());
    }

    randomDeploy() {
        this.shipsSqr = [];
        for (const length of this.shipsLength) {
            const mode = (Math.random() > 0.50) ? "v" : "h";
            let line, column;
            while (true) {
                line = Math.floor(Math.random() * 10);
                column = Math.floor(Math.random() * 10);
                if (this.#checkCoordsAhead([line, column], mode, length)) break;
            }
            this.board.placeShip(length, [line, column], mode);
            if (mode === "h") {
                const indexes = [];
                for (let i = 0; i < length; i++) {
                    const index = (line * 10) + (column + 1 * i)
                    indexes.push(index);
                }
                this.validDeploy = this.validDeploy.filter(num => !indexes.includes(num));
            }
            if (mode === "v") {
                const indexes = [];
                for (let i = 0; i < length; i++) {
                    const index = ((line * 10) + 10 * i) + column;
                    indexes.push(index);
                }
                this.validDeploy = this.validDeploy.filter(num => !indexes.includes(num));
            }
        }
    };

    async randomAttack(boardObj) {
        const missedAttacksCount = boardObj.getMissedAttacks().length;
        while (missedAttacksCount === boardObj.getMissedAttacks().length) {
            const randomIndex = Math.floor(Math.random() * this.validAttack.length);
            let line, column;
            const randomCoord = this.validAttack[randomIndex];
            column = randomCoord % 10;
            line = Math.floor(randomCoord / 10);
            // console.log({
            //     randomIndex,
            //     line,
            //     column,
            //     randomCoord
            // })
            this.validAttack.splice(randomIndex, 1);
            // console.log("before",boardObj.getHits().length);
            boardObj.receiveAttack([line, column]);
            // console.log("after",boardObj.getHits().length)
        }
        // await this.#delay(1000);
    }

    #delay(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, ms);
        });
    }

    #checkCoordsAhead(firstCoord, mode, length) {
        if (typeof firstCoord === "string" && firstCoord.length === 3) {
            firstCoord = `${firstCoord.charAt(0)}${firstCoord.charAt(1)}`;
            firstCoord = firstCoord.split("");
        }
        if (!(Array.isArray(firstCoord))) throw new Error("invalid first coord");
        if (typeof mode !== "string") throw new Error("invalid mode");
        const [y, x] = firstCoord;
        if (mode.charAt(0).toLowerCase() === "v") {
            for (let line = 0; line < length; line++) {
                if (y + line > 9) return false;
                if (!(this.validDeploy.includes(Number(`${line + y}${x}`)))) return false;
            }
        } else if (mode.charAt(0).toLowerCase() === "h") {
            for (let column = 0; column < length; column++) {
                console.log(`y:${y} x:${x}`);
                console.log(this.board.getSquare([y, x + column]));
                if (x + column > 9) return false;
                if (!(this.validDeploy.includes(Number(`${y}${x + column}`)))) return false;
            }
        } else {
            throw new Error("invalid mode");
        }
        return true;
    }
}
