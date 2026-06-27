export default class DomManager {
    constructor(playerBoard, botBoard, game) {
        this.pBoard = playerBoard;
        this.bBoard = botBoard;
        this.game = game;
    }

    refreashBoard(boardDiv) {
        boardDiv.innerHTML = '';
        if (!boardDiv.classList.contains('listen'))
            this.#BoardListens(boardDiv);
        let boardObj =
            boardDiv.dataset.player === 'player' ? this.pBoard : this.bBoard;
        for (let line = 0; line < 10; line++) {
            for (let column = 0; column < 10; column++) {
                const uiSqr = document.createElement('div');
                const objSqr = boardObj.getSquare(line * 10 + column);
                uiSqr.classList.add('ui-sqr');
                uiSqr.dataset.column = column;
                uiSqr.dataset.line = line;
                uiSqr.dataset.isShip = objSqr.ship !== null ? true : false;
                uiSqr.dataset.missedAttack =
                    !objSqr.ship && objSqr.isHit ? true : false;
                uiSqr.dataset.shipAttacked =
                    objSqr.ship && objSqr.isHit ? true : false;
                if (uiSqr.dataset.missedAttack === 'true') {
                    uiSqr.textContent = 'X';
                    uiSqr.classList.add('miss-hit');
                }
                if (uiSqr.dataset.shipAttacked === 'true')
                    uiSqr.classList.add('hit');
                if (uiSqr.dataset.isShip === 'true')
                    uiSqr.classList.add('ship');
                boardDiv.appendChild(uiSqr);
            }
        }
    }

    insertShipUi() {
        const playerInfoSec = document.querySelector('.player-info');
        this.#updatePlayerInfo(playerInfoSec, 's');
    }

    turnInfoUi() {
        const playerInfoSec = document.querySelector('.player-info');
        this.#updatePlayerInfo(playerInfoSec, 't');
    }

    #updatePlayerInfo(parent, mode, gameInfoObj = { round: 1, turn: 'none' }) {
        if (mode !== 's' || mode !== 't')
            throw new Error(`${mode} is not a valid mode`);
        if (mode === 's') {
            const shipBtn = document.createElement('button');
            shipBtn.classList.add('ship-hand');
            shipBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m280-400 200-200 200 200H280Z"/></svg> <span class="poppins-font">deploy ships</span>`;
            shipBtn.addEventListener('click', () => {
                const existDiv = document.querySelector('#ship-hand-div');
                if (!existDiv) {
                    const shipHandDiv = document.createELement('div');
                    shipHandDiv.setAttribute('id', 'ship-hand-div');
                    parent.append(shipHandDiv);
                } else {
                    parent.removeChild(existDiv);
                }
            });

            parent.innerHTML = '';
            parent.appendChild(shipBtn);
            return;
        }
        if (mode === 't') {
            const playerTurnSpan = document.createElement('span');
            const roundSpan = document.createElement('span');
            const roundNumSpan = document.createElement('span');
            const infoDiv = document.createElement('div');

            playerTurnSpan.classList.add('turn', 'poppins-font');
            playerTurnSpan.textContent = `${gameInfoObj.turn} turn`;
            roundSpan.classList.add('round-number', 'poppins-font');
            roundSpan.textContent = 'round:';
            roundNumSpan.classList.add('num', 'poppins-font');
            roundNumSpan.textContent = gameInfoObj.round;
            infoDiv.classList.add('player-turn');

            infoDiv.appendChild(playerTurnSpan);
            infoDiv.appendChild(roundSpan);
            infoDiv.appendChild(roundNumSpan);

            parent.innerHTML = '';
            parent.appendChild(infoDiv);
            return;
        }
    }

    callWinnerDialog(winner, player1Pont, player2Pont) {
        const dialog = document.querySelector('#winner-modal');
        this.#updateWinnerDialog(winner, player1Pont, player2Pont, dialog);

        if (!dialog.classList.contains('called')) {
            this.#initializeCloseWinnerDialog(dialog);
            this.#initializeContinueBtn(
                this.game.resume.bind(this.game),
                dialog
            );
            this.#initializeRestartBtns(
                this.game.restart.bind(this.game),
                dialog
            );
            dialog.classList.add('called');
        }
        dialog.showModal();
    }

    #updateWinnerDialog(winner, player1Pont, player2Pont, dialog) {
        const winnerNameSpan = dialog.querySelector('.winner-name');
        const p1PontSpan = dialog.querySelector('.p1-pont');
        const p2PontSpan = dialog.querySelector('.p2-pont');

        winnerNameSpan.textContent = winner;
        p1PontSpan.textContent = player1Pont;
        p2PontSpan.textContent = player2Pont;
    }

    #initializeCloseWinnerDialog(dialog) {
        const closeBtn = document.querySelector('.close-modal');

        closeBtn.addEventListener('click', () => {
            dialog.close();
        });
    }

    #initializeContinueBtn(callback, dialog) {
        const continueBtn = dialog.querySelector('.winner-continue');
        continueBtn.addEventListener('click', () => {
            callback();
            dialog.close();
            this.game.start();
        });
    }

    #initializeRestartBtns(callback, dialog) {
        const restBtns = document.querySelectorAll('.restart');
        restBtns.forEach((el) =>
            el.addEventListener('click', () => {
                callback();
                dialog.close();
                this.game.start();
            })
        );
    }

    #BoardListens(boardDiv) {
        boardDiv.classList.add('listen');
        boardDiv.addEventListener('click', (e) => {
            const line = e.target.dataset.line;
            const column = e.target.dataset.column;
            const coords = Number(line) * 10 + Number(column);
            this.game.attackSqr(coords);
        });
    }
}
