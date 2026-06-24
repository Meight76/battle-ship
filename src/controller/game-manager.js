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
        this.rWinner = null;
    }

    // should begin and put game in-process
     async start() {
        // first render the two boards;
        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);

        this.#state = "deployment";
         await this.#insetionTime();

         while (true) {
            await this.#attackTime(this.#pBoard, this.#pBoardUi);
            if (this.#pBoard.isAllSunk()) {
                this.rWinner = "bot";
                break;
            }
            await this.#attackTime(this.#bBoard, this.#bBoardUi);
            if (this.#bBoard.isAllSunk()) {
                this.rWinner = "player";
                break;
            };
         }
    }

     async #insetionTime() {
        // update interface
        this.#d.insertShipUi();
        setTimeout(() => {
            this.#pBoard.placeShip(2, [1, 2], "h");
            // this.#pBoard.placeShip(3, [2, 3], "h");
            // this.#pBoard.placeShip(4, [3, 2], "h");
            // this.#pBoard.placeShip(5, [4, 2], "h");
            // this.#pBoard.placeShip(6, [6, 2], "h");
            // this.#bBoard.placeShip(2, [1, 2], "h");
            // this.#bBoard.placeShip(3, [2, 3], "h");
            // this.#bBoard.placeShip(4, [3, 2], "h");
            // this.#bBoard.placeShip(5, [4, 2], "h");
            this.#bBoard.placeShip(6, [6, 2], "h");

        }, 3000);
        // verify each 100ms if user has deployed all five ships
        await new Promise(resolve => {
            const interval = setInterval(() => {
                if (this.#pBoard.getShips().length === 1) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
        this.#d.turnInfoUi();
        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);
    }
    async #attackTime(boardObj, boardUi) {
        let attackAmount = boardObj.getHits().length;
        this.#d.attackAllowedOnce(boardUi, boardObj);
        await new Promise(resolve => {
            const interval = setInterval(() => {
               if (boardObj.getHits().length > attackAmount) {
                console.log(boardObj.getHits().length);
                clearInterval(interval);
                resolve();
               }
            }, 100);
        })
    }
}
