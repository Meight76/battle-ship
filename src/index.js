import './template.css';
import DomManager from './controller/dom-manager.js';
import Player from './classes/player-template.js';
import Game from './controller/game-manager.js';

const pBoardUi = document.querySelector('.board-1');
const bBoardUi = document.querySelector('.board-2');
const startBtn = document.querySelector('.start');

const gameObj = new Game();
startBtn.addEventListener('click', gameObj.start.bind(gameObj));
