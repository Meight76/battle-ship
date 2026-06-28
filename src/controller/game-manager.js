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
    #pTimesPlayed;
    #bTimesPlayed;
    #firstGameLoaded;
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
        this.#pTimesPlayed = 0;
        this.#bTimesPlayed = 0;
        this.#firstGameLoaded = true;
    }

    // restart essential priorities to initial value
    restart() {
        this.#p = new Player();
        this.#b = new Bot();
        this.#pBoard = this.#p.board;
        this.#bBoard = this.#b.board;
        this.#d.bBoard = this.#bBoard;
        this.#d.pBoard = this.#pBoard;
        this.#turn = Math.random() > 0.5 ? 'p' : 'b';
        this.#isAttackTime = false;
        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);
        this.#d.updateStats(this.#p.pontuaction, this.#b.pontuaction);
        this.#pTimesPlayed = 0;
        this.#bTimesPlayed = 0;
    }
    // restart only necessary to have another sequential round
    resume() {
        this.#pBoard.resetBoard();
        this.#bBoard.resetBoard();
        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);
        this.#turn = Math.random() > 0.5 ? 'p' : 'b';
        this.#isAttackTime = false;
        this.#pTimesPlayed = 0;
        this.#bTimesPlayed = 0;
    }

    // this is game loop
    async start() {
        // in case user click startBtn in the middle of a game in-progress
        if (
            this.#pBoard.ships.length !== 0 ||
            this.#bBoard.ships.length !== 0
        ) {
            this.resume();
        }
        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);
        // await for both ships board to be placed
        await this.#insertionTime();
        // update playerInfo(div) content to represent rounds
        this.#d.refreashBoard(this.#pBoardUi);
        this.#d.refreashBoard(this.#bBoardUi);
        this.#firstGameLoaded = false;

        // this property is a rule that allow player to attack board from Dom method
        this.#isAttackTime = true;
        while (true) {
            const turn = this.#turn === 'p' ? 'player' : 'bot';
            const round = this.roundCount;
            this.#d.turnInfoUi({ turn, round });
            if (this.#turn === 'p') {
                this.#pTimesPlayed++;
                // await player to click and attack a square
                await this.#playerAttack(this.#bBoard, this.#bBoardUi);
                // if it's bot's ships are all sunk then player won
                if (this.#bBoard.isAllSunk()) {
                    this.#p.pontuaction++;
                    this.#d.refreashBoard(this.#pBoardUi);
                    // this true here means isEndGame, it doesn't make any difference in player's board
                    this.#d.refreashBoard(this.#bBoardUi, true);
                    this.#d.callWinnerDialog(
                        'player',
                        this.#p.pontuaction,
                        this.#b.pontuaction
                    );
                    this.#d.updateStats(this.#p.pontuaction, this.#b.pontuaction);
                    this.#isAttackTime = false;
                    break;
                }
                // swap turn
                this.#turn = 'b';
            } else {
                this.#bTimesPlayed++;
                // bot choose and attack randomly
                this.#b.randomAttack(this.#pBoard);
                await new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
                this.#d.refreashBoard(this.#pBoardUi);
                // if player's ships are all sunk then bot won
                if (this.#pBoard.isAllSunk()) {
                    this.#b.pontuaction++;
                    this.#d.refreashBoard(this.#pBoardUi);
                    // this true here means isEndGame, allow user to see bot's ships
                    this.#d.refreashBoard(this.#bBoardUi, true);
                    this.#d.callWinnerDialog(
                        'bot',
                        this.#p.pontuaction,
                        this.#b.pontuaction
                    );
                    this.#d.updateStats(this.#p.pontuaction, this.#b.pontuaction);
                    this.#isAttackTime = false;
                    break;
                }
                // swap turn
                this.#turn = 'p';
            }
        }
    }
    // it's not actually finished, it's lacking allow player to manually place ships by dragging them
    async #insertionTime() {
        // call Dom method to update playerInfo(div) to represent ships
        this.#d.insertShipUi();
        // it'll verify each 100ms, if player has placed its five ships as well as bot (but bot doesn't count kkk)
        await new Promise((resolve) => {
            this.#playerDeployUi();
            this.#b.randomDeploy();
            const interval = setInterval(() => {
                console.log(
                    this.#pBoard.ships.length,
                    this.#bBoard.ships.length
                );
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
    // once player can call attack everytime since start, this function just await for they to do so
    // this should be the only period where player.attack() should be validate and accepted
    async #playerAttack() {
        return new Promise((resolve) => {
            // if player sucessfully hit a ship, they should continue attacking
            // i just care if they miss an attack
            const missCount = this.#bBoard.missedHits.length;
            const interval = setInterval(() => {
                // if they miss an attack, they're turn should be finished
                if (
                    this.#bBoard.missedHits.length > missCount ||
                    this.#bBoard.isAllSunk()
                ) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    #playerDeployUi() {
        // add EventListeners to allow user to drag ships
        if (this.#firstGameLoaded) this.#d.boardDragUi(this.#pBoardUi);
    }

    // this is the function that validates if player attack is valid as well as the one that accept it
    attackSqr(coords) {
        if (
            this.#turn !== 'p' ||
            !this.#isAttackTime ||
            this.#bBoard.getSquare(coords).isHit
        )
            return;
        this.#p.attack(this.#bBoard, coords);
    }

    get roundCount() {
        // i added one because it was off by one
        return Math.min(this.#bTimesPlayed, this.#pTimesPlayed) + 1;
    }
}
