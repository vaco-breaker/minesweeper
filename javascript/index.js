import Game from './game.js';

const $startButton = document.querySelector('#startButton');
// const $resetButton = document.querySelector('#resetButton');

const game = new Game();
const handleStartButtonClick = () => {
  game.start();
};

$startButton.addEventListener('click', handleStartButtonClick);
