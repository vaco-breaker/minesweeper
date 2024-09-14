import Game from './game.js';

const $mainTag = document.querySelector('main');
const $flagNumber = document.querySelector('#flagNumber');
const $startButton = document.querySelector('#startButton');
const $resetButton = document.querySelector('#resetButton');
const $gameBoard = document.querySelector('#gameBoard');

const game = new Game(document);
const clickStartCallback = () => {
  game.start();
};

$startButton.addEventListener('click', clickStartCallback);
