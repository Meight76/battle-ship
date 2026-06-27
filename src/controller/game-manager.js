import Bot from '../classes/bot-template.js';
import Player from '../classes/player-template.js';
import DomManager from './dom-manager.js';

export default class Game {
    #p;
    #b;
    #d;
    #pBoard;
    #bBoard;
    #pBoardUi;
    #bBoardUi;
    #turn;
    #isAttackTime;
    constructor() {
        this.#p = new Player();
        this.#b = new Bot();
        this.#pBoard = this.#p.board;
        this.#bBoard = this.#b.board;
        this.#pBoardUi = document.querySelector('.board-1');
        this.#bBoardUi = document.querySelector('.board-2');
        this.#d = new DomManager(this.#pBoard, this.#bBoard, this);
        this.#turn = Math.random() > 0.5 ? 'p' : 'b';
        this.#isAttackTime = false;
    }

    restart() {
        this.#p = new Player();
        this.#b = new Bot();
        this.#pBoard = this.#p.board;
        this.#bBoard = this.#b.board;
        this.#turn = Math.random > 0.5 ? 'p' : 'b';
        this.#isAttackTime = false;
    }

    resume() {
        this.#pBoard.resetBoard();
        this.#bBoard.resetBoard();
        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);
        this.#isAttackTime = false;
    }

    async start() {
        if (
            this.#pBoard.ships.length !== 0 ||
            this.#bBoard.ships.length !== 0
        ) {
            this.resume();
        }

        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);

        await this.#insertionTime();
        this.#d.turnInfoUi().this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);

        this.#isAttackTime = true;
        while (true) {
            if (this.#turn === 'p') {
                await this.#playerAttack(this.#bBoard, this.#bBoardUi);
                if (this.#bBoard.isAllSunk()) {
                    this.#p.pontuaction++;
                    this.#d.callWinnerDialog(
                        'player',
                        this.#p.pontuaction,
                        this.#b.pontuaction
                    );
                    break;
                }
                this.#turn = 'b';
            } else {
                this.#b.randomAttack(this.#pBoard);
                this.#d.refreashBoard(this.#pBoardUi);
                if (this.#pBoard.isAllSunk()) {
                    this.#b.pontuaction++;
                    this.#d.callWinnerDialog(
                        'bot',
                        this.#p.pontuaction,
                        this.#b.pontuaction
                    );
                    break;
                }
                this.#turn = 'p';
            }
        }
    }

    async #insertionTime() {
        this.#d.insertShipUi();
        await new Promise((resolve) => {
            this.#p.deployShips();
            this.#b.randomDeploy();
            const interval = setInterval(() => {
                if (
                    this.#p.board.ships.length === 5 &&
                    this.#b.board.ships.length === 5
                ) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    async #playerAttack() {
        return new Promise((resolve) => {
            const missCount = this.#bBoard.missedHits.length;
            const interval = setInterval(() => {
                if (this.#bBoard.missedHits.length > missCount) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    attackSqr(coords) {
        if (
            this.#turn !== 'p' ||
            this.#isAttackTime ||
            this.#bBoard.getSquare(coords).isHit
        )
            return;
        this.#p.attack(this.#bBoard, coords);
    }
}
