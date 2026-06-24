import "./template.css";
import DomManager from "./controller/dom-manager.js";
import Player from "./classes/player-template.js";

const pBoardUi = document.querySelector(".board-1");
const bBoardUi = document.querySelector(".board-2");
const p = new Player();
const bp = new Player();
const pBoardObj = p.board;
const bBoardObj = bp.board;

pBoardObj.placeShip(5, [5,4], "v");

const gameUi = new DomManager(pBoardObj, bBoardObj);

gameUi.refreashBoard(pBoardUi);
gameUi.refreashBoard(bBoardUi);
gameUi.attackAllowedOnce(pBoardUi);

// console.log(document.querySelector(".ship"));
