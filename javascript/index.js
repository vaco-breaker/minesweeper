import Game from './game.js';

const $startButton = document.querySelector('#startButton');
const $resetButton = document.querySelector('#resetButton');

const game = new Game();
const clickStartCallback = () => {
  game.start();
};

$startButton.addEventListener('click', clickStartCallback);
