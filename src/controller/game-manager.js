import Player from "../classes/player-template.js";
import DomManager from "./dom-manager.js";

export default class Game {
    #p;
    #b;
    #d;
    #pBoard;
    #bBoard;
    #state;
    #pBoardUi;
    #bBoardUi;
    constructor() {
        this.#p = new Player();
        this.#b = new Player();
        this.#pBoard = this.#p.board;
        this.#bBoard = this.#b.board;
        this.#pBoardUi = document.querySelector(".board-1");
        this.#bBoardUi = document.querySelector(".board-2");
        this.#d = new DomManager(this.#pBoard, this.#bBoard);
        this.#state = "start";
    }

    // should begin and put game in-process
     async start() {
        // first render the two boards;
        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);

        this.#state = "deployment";
         await this.#insetionTime();

         while (!(this.#pBoard.isAllSunk()) && !(this.#bBoard.isAllSunk())) {
            this.#d.attackAllowedOnce(this.#pBoardUi);
            await new Promise(resolve => {
                const interval = setInterval(() => {

                }, interval);
            });
            this.#d.attackAllowedOnce(this.#bBoardUi);
         }
    }

     async #insetionTime() {
        // update interface
        this.#d.insertShipUi();
        setTimeout(() => {
            this.#pBoard.placeShip(2, [1, 2], "h");
            this.#pBoard.placeShip(3, [2, 3], "h");
            this.#pBoard.placeShip(4, [3, 2], "h");
            this.#pBoard.placeShip(5, [4, 2], "h");
            this.#pBoard.placeShip(6, [6, 2], "h");
            this.#bBoard.placeShip(2, [1, 2], "h");
            this.#bBoard.placeShip(3, [2, 3], "h");
            this.#bBoard.placeShip(4, [3, 2], "h");
            this.#bBoard.placeShip(5, [4, 2], "h");
            this.#bBoard.placeShip(6, [6, 2], "h");

        }, 3000);
        // verify each 100ms if user has deployed all five ships
        await new Promise(resolve => {
            const interval = setInterval(() => {
                if (this.#pBoard.getShips().length === 5) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
        this.#d.turnInfoUi();
        this.#d.refreashBoard(this.#pBoardUi);
    }

}
