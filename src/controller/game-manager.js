import Bot from "../classes/bot-template.js";
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
        this.#b = new Bot();
        this.#pBoard = this.#p.board;
        this.#bBoard = this.#b.board;
        this.#pBoardUi = document.querySelector(".board-1");
        this.#bBoardUi = document.querySelector(".board-2");
        this.#d = new DomManager(this.#pBoard, this.#bBoard, this);
        this.#state = "start";
        this.rWinner = null;
    }


    // reset whole game class
    restart() {
        this.#p = new Player();
        this.#b = new Bot();
        this.#p.board.resetBoard();
        this.#b.board.resetBoard();
        this.#d = new DomManager(this.#pBoard, this.#bBoard, this);
        this.#state = "start";
        this.rWinner = null;
        this.#d.refreashBoard(this.#bBoardUi);
        this.#d.refreashBoard(this.#pBoardUi);
    }

    resume() {
        this.#state = "start";
        this.rWinner = null;
        const old = this.#pBoard.getSquare([0, 0]);
        this.#pBoard.resetBoard();
        const newb = this.#pBoard.getSquare([0, 0]);
        this.#bBoard.resetBoard();
        console.log(old === newb);
        this.#d = new DomManager(this.#pBoard, this.#bBoard, this);
        this.#b.restart()
        this.#d.refreashBoard(this.#bBoardUi);
        this.#d.refreashBoard(this.#pBoardUi);
    }

    // should begin and put game in-process
     async start() {
        console.log("called");
        if (this.#pBoard.getShips().length !== 0 || this.#bBoard.getShips().length !== 0) {
            this.resume();
        }
        // first render the two boards;
        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);

        this.#state = "deployment";
         await this.#insetionTime();

         this.#state = "attacking";
         let turn = (Math.random() > 0.5) ? "p" : "b";
         while (true) {
            if (turn === "p") {
                await this.#attackTime(this.#bBoard, this.#bBoardUi);
                if (this.#bBoard.isAllSunk()) {
                    this.#p.pontuaction++;
                    this.#d.callWinnerDialog("player", this.#p.pontuaction, this.#b.pontuaction);
                    break;
                };
                turn = "b";
            } else {
                await this.#b.randomAttack(this.#pBoard);
                this.#d.refreashBoard(this.#pBoardUi);
                if (this.#pBoard.isAllSunk()) {
                    this.#b.pontuaction++;
                    this.#d.callWinnerDialog("bot", this.#p.pontuaction, this.#b.pontuaction);
                    break;
                }
                turn = "p";
            }
         }
         this.#state = "game over";
    }

     async #insetionTime() {
        // update interface
        this.#d.insertShipUi();
        setTimeout(() => {
            this.#pBoard.placeShip(6, [1, 1], "h");
            this.#pBoard.placeShip(6, [2, 1], "h");
            this.#pBoard.placeShip(6, [3, 1], "h");
            this.#pBoard.placeShip(6, [4, 1], "h");
            this.#pBoard.placeShip(6, [5, 1], "h");
            this.#pBoard.placeShip(6, [6, 1], "h");
            this.#pBoard.placeShip(6, [7, 1], "h");

            this.#b.randomDeploy();
        }, 3000);
        // verify each 100ms if user has deployed all five ships
        await new Promise(resolve => {
            const interval = setInterval(() => {
                if (this.#pBoard.getShips().length === 7) {
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
        let missedAttack = boardObj.getMissedAttacks();
        this.#d.attackAllowedOnce(boardUi, boardObj);
        await new Promise(resolve => {
            const interval = setInterval(() => {
               if ((boardObj.getHits().length > attackAmount && boardObj.getMissedAttacks().length !== missedAttack.length) || boardObj.isAllSunk() || missedAttack.length < boardObj.getMissedAttacks().length) {
                clearInterval(interval);
                resolve();
               }
            }, 100);
        })
    }
}
