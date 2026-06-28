export default class DomManager {
    constructor(playerBoard, botBoard, game) {
        this.pBoard = playerBoard;
        this.bBoard = botBoard;
        this.game = game;
    }
    // update board
    // isEndGame means game is over, this will allow user to see all bot's ships
    refreashBoard(boardDiv, isEndGame) {
        // clear all it's inside content, because this function expect an empty div
        boardDiv.innerHTML = '';
        // if it doesn't have listen class it means it's the first call from function
        if (!boardDiv.classList.contains('listen'))
            this.#BoardListens(boardDiv);
        let boardObj =
            boardDiv.dataset.player === 'player' ? this.pBoard : this.bBoard;
        // based on boardObj it creates a boardUi
        for (let line = 0; line < 10; line++) {
            for (let column = 0; column < 10; column++) {
                const uiSqr = document.createElement('div');
                const objSqr = boardObj.getSquare(line * 10 + column);
                uiSqr.classList.add('ui-sqr');
                // make use from dataset to store info to help making methods later
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
                if (boardObj === this.bBoard && !isEndGame) uiSqr.classList.add('bot');
                boardDiv.appendChild(uiSqr);
            }
        }
    }

    insertShipUi() {
        const playerInfoSec = document.querySelector('.player-info');
        this.#updatePlayerInfo(playerInfoSec, 's');
    }

    turnInfoUi(gameInfoObj) {
        const playerInfoSec = document.querySelector('.player-info');
        this.#updatePlayerInfo(playerInfoSec, 't', gameInfoObj);
    }

    // alter playerInfo(div) content, recreating everytime
    // mode === 's' means ship, mode === 't', means turn
    // parent is expected to be .player-info
    #updatePlayerInfo(parent, mode, gameInfoObj = { round: 1, turn: 'none' }) {
        if (mode !== 's' && mode !== 't')
            throw new Error(`${mode} is not a valid mode`);
        if (mode === 's') {
            const shipBtn = document.createElement('button');
            shipBtn.classList.add('ship-hand');
            shipBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m280-400 200-200 200 200H280Z"/></svg> <span class="poppins-font">deploy ships</span>`;
            // if div exist remove it from page, if it doesn't exist add to page
            // swap between in page and not
            shipBtn.addEventListener('click', () => {
                const existDiv = document.querySelector('#ship-hand-div');
                if (!existDiv) {
                    const shipHandDiv = document.createElement('div');
                    shipHandDiv.setAttribute('id', 'ship-hand-div');
                    parent.append(shipHandDiv);
                    this.renderShipHand(this.pBoard);
                } else {
                    parent.removeChild(existDiv);
                }
            });
            // remember function expect to add a whole new div, it cannot contain already one
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
            console.log(gameInfoObj.turn);
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

    // update modal with its passed arguments and call it
    callWinnerDialog(winner, player1Pont, player2Pont) {
        const dialog = document.querySelector('#winner-modal');
        this.#updateWinnerDialog(winner, player1Pont, player2Pont, dialog);

        // if it's the first time calling modal, add its eventListeners
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

    updateStats(p1Points, p2Points) {
        const p1Stats = document.querySelector(".player1-pont");
        const p2Stats = document.querySelector(".player2-pont");
        p1Stats.textContent = p1Points;
        p2Stats.textContent = p2Points;
    }

    #updateWinnerDialog(winner, player1Pont, player2Pont, dialog) {
        const winnerNameSpan = dialog.querySelector('.winner-name');
        const p1PontSpan = dialog.querySelector('.p1-pont');
        const p2PontSpan = dialog.querySelector('.p2-pont');
        if (winner === 'player') {
            dialog.classList.remove("winner-b");
            dialog.classList.add("winner-p");
        } else {
            dialog.classList.remove("winner-p");
            dialog.classList.add("winner-b");
        }

        winnerNameSpan.innerHTML = `<span>${winner}</span><span>wins!</span>`;
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

    renderShipHand(boardObj) {
        // get container to append ships
        const div = document.querySelector('#ship-hand-div');
        div.innerHTML = '';
        // each time this div will be updated it'll know the ships to make
        for (const length of boardObj.shipsToDeploy) {
            const ship = document.createElement('div');
            ship.classList.add('ship-ui');

            const sSqrG = document.createElement('div');
            sSqrG.dataset.length = length;
            sSqrG.classList.add('ship-ui-sqr-g');
            sSqrG.setAttribute('draggable', true);
            sSqrG.dataset.mode = 'h';
            sSqrG.addEventListener('dragstart', () => {
                sSqrG.classList.add('drag');
            });

            const changePosBtn = document.createElement('button');
            changePosBtn.classList.add('change-pos-btn');
            changePosBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M204-318q-22-38-33-78t-11-82q0-134 93-228t227-94h7l-64-64 56-56 160 160-160 160-56-56 64-64h-7q-100 0-170 70.5T240-478q0 26 6 51t18 49l-60 60ZM481-40 321-200l160-160 56 56-64 64h7q100 0 170-70.5T720-482q0-26-6-51t-18-49l60-60q22 38 33 78t11 82q0 134-93 228t-227 94h-7l64 64-56 56Z"/></svg>`;
            changePosBtn.addEventListener('click', () => {
                sSqrG.dataset.mode = sSqrG.dataset.mode === 'v' ? 'h' : 'v';
                if (sSqrG.dataset.mode === 'h') {
                    sSqrG.style.flexDirection = 'row';
                } else {
                    sSqrG.style.flexDirection = 'column';
                }
            });
            sSqrG.appendChild(changePosBtn);
            sSqrG.addEventListener('dragend', () => {
                sSqrG.classList.remove('drag');
            });
            // generate the squares inside div
            for (let i = 0; i < length; i++) {
                const sSqr = document.createElement('div');
                sSqr.classList.add('ship-ui-sqr');
                sSqrG.appendChild(sSqr);
                ship.appendChild(sSqrG);
            }
            div.appendChild(ship);
        }
    }

    boardDragUi(boardUi) {
        let middleSqrUi;
        let dragEl;
        let length;
        let mode;
        boardUi.addEventListener('dragover', (e) => {
            e.preventDefault();
            dragEl = document.querySelector('.drag');
            mode = dragEl.dataset.mode;
            length = dragEl.dataset.length;
            middleSqrUi = e.target.closest('.ui-sqr');
            console.log(middleSqrUi, dragEl, length);
        });
        boardUi.addEventListener('drop', () => {
            const offSet = Math.floor(length / 2);
            const y = Number(middleSqrUi.dataset.line);
            const x = Number(middleSqrUi.dataset.column);
            if (mode === 'h') {
                this.pBoard.placeShip(
                    Number(length),
                    y * 10 + (x - offSet),
                    'h'
                );
            } else {
                this.pBoard.placeShip(
                    Number(length),
                    (y - offSet) * 10 + x,
                    'v'
                );
            }
            this.refreashBoard(boardUi);
            this.renderShipHand(this.pBoard);
        });
    }

    // player board should be able to call attack function everytime since start
    // Game class should decide when it's a valid attack, if not just ignore it
    #BoardListens(boardDiv) {
        if (boardDiv.dataset.player === 'player') return;
        boardDiv.classList.add('listen');
        boardDiv.addEventListener('click', (e) => {
            if (!e.target.classList.contains('ui-sqr')) return;
            const line = e.target.dataset.line;
            const column = e.target.dataset.column;
            const coords = Number(line) * 10 + Number(column);
            console.log({ column, line, coords });
            this.game.attackSqr(coords);
            this.refreashBoard(boardDiv);
        });
    }
}
