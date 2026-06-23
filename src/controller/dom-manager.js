import Player from "../classes/player-template.js";

export default class DomManager {
    #player;
    #botPlayer;

    constructor() {
        this.#player = new Player();
        this.#botPlayer = new Player();
        this.pBoard = this.#player.board;
        this.bBoard = this.#botPlayer.board;
    }

    refreashBoard(boardDiv) {
        let boardObj = (boardDiv.dataset.player === "player") ? this.pBoard : this.bBoard;
        const missedAttacks = boardObj.getMissedAttacks();
        for (let line = 0; line < 10; line++) {
            for (let column = 0; column < 0; column++) {
                const uiSqr = document.createElement("div");
                uiSqr.classList.add("ui-sqr");
                uiSqr.dataset.column = column;
                uiSqr.dataset.line = line;
                uiSqr.dataset.missedAttack = missedAttacks.includes(`${line},${column}`);
                uiSqr.dataset.shipAttacked =
                if (uiSqr.dataset.missedAttack) uiSqr.classList.add("missed");
            }
        }
    }
}
