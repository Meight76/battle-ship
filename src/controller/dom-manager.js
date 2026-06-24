
export default class DomManager {

    constructor(playerBoard, botBoard) {
        this.pBoard = playerBoard;
        this.bBoard = botBoard;
    }

    // update board
    refreashBoard(boardDiv) {
        boardDiv.innerHTML = "";
        let boardObj = (boardDiv.dataset.player === "player") ? this.pBoard : this.bBoard;
        for (let line = 0; line < 10; line++) {
            for (let column = 0; column < 10; column++) {
                const uiSqr = document.createElement("div");
                const objSqr = boardObj.getSquare([line, column]);
                if (line === 5 && column === 4) {
                    console.log(objSqr);
                }
                uiSqr.classList.add("ui-sqr");
                uiSqr.dataset.column = column;
                uiSqr.dataset.line = line;
                uiSqr.dataset.isShip = (objSqr.shipPointer !== null) ? true : false;
                uiSqr.dataset.missedAttack = (!objSqr.shipPointer && objSqr.isHit) ? true : false;
                uiSqr.dataset.shipAttacked = (objSqr.shipPointer && objSqr.isHit) ? true : false;
                if (uiSqr.dataset.missedAttack === "true") {
                    uiSqr.textContent = "X";
                    uiSqr.classList.add("miss-hit");
                }
                if (uiSqr.dataset.shipAttacked === "true") uiSqr.classList.add("hit");
                if (uiSqr.dataset.isShip === "true") uiSqr.classList.add("ship");
                boardDiv.appendChild(uiSqr);
            }
        }
    }

    //allow user to attack one square
    attackAllowedOnce(boardDiv) {
        boardDiv.addEventListener("click", (e) => {
            const line = e.target.dataset.line;
            const column = e.target.dataset.column;
            this.pBoard.receiveAttack([Number(line), Number(column)]);
            console.log(line, column);
            this.refreashBoard(boardDiv);
        }, {once: true})
    }

    // update ui to allow insertion
    insertShipUi(){
        const playerInfoSec = document.querySelector(".player-info");
        this.#updatePlayerInfo(playerInfoSec, "s");


    }

    turnInfoUi() {
        const playerInfoSec = document.querySelector(".player-info");
        this.#updatePlayerInfo(playerInfoSec, "t");
    }

    #updatePlayerInfo(parent, mode, gameInfoObj = {round: 2, turn: "player 1"}) {
        if (typeof mode !== "string") throw new Error("Invalid mode for updatePlayerInfo");
        if (mode.charAt(0).toLowerCase() === "s") {
            const shipBtn = document.createElement("button");
            shipBtn.classList.add("ship-hand");
            shipBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m280-400 200-200 200 200H280Z"/></svg> <span class="poppins-font">deploy ships</span>`
            shipBtn.addEventListener("click", () => {
                const existDiv = document.querySelector("#ship-hand-div");
                if (existDiv === null) {
                    const shipHandDiv = document.createElement("div");
                    shipHandDiv.setAttribute("id", "ship-hand-div");
                    parent.appendChild(shipHandDiv);
                } else {
                    parent.removeChild(existDiv);
                }
            });

            parent.innerHTML = "";
            parent.appendChild(shipBtn);
        } else if (mode.charAt(0).toLowerCase() === "t") {
            const playerTurnSpan = document.createElement("span");
            const roundSpan = document.createElement("span")
            const roundNumSpan = document.createElement("span");
            const infoDiv = document.createElement("div");


            playerTurnSpan.classList.add("turn", "poppins-font");
            playerTurnSpan.textContent = `${gameInfoObj.turn} turn`
            roundSpan.classList.add("round-number", "poppins-font");
            roundSpan.textContent = "Round:"
            roundNumSpan.classList.add("num", "poppins-font");
            roundNumSpan.textContent = gameInfoObj.round;
            infoDiv.classList.add("player-turn");

            infoDiv.appendChild(playerTurnSpan);
            infoDiv.appendChild(roundSpan);
            infoDiv.appendChild(roundNumSpan);

            parent.innerHTML = "";
            parent.appendChild(infoDiv);
        }
    }
}
