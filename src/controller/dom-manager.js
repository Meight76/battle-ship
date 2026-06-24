
export default class DomManager {

    constructor(playerBoard, botBoard) {
        this.pBoard = playerBoard;
        this.bBoard = botBoard;
    }

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

    attackAllowedOnce(boardDiv) {
        boardDiv.addEventListener("click", (e) => {
            const line = e.target.dataset.line;
            const column = e.target.dataset.column;
            this.pBoard.receiveAttack([Number(line), Number(column)]);
            console.log(line, column);
            this.refreashBoard(boardDiv);
        }, {once: true})
    }

    allowInsertShipUi(){

    }
}
