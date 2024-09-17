import Game from './game.js';

const $startButton = document.querySelector('#startButton');
const $resetButton = document.querySelector('#resetButton');

const game = new Game();

const handleStartButtonClick = () => {
  if (game.isGamePlaying) return;

  $startButton.classList.remove('pointer');
  $startButton.classList.add('disabled');
  $resetButton.classList.add('pointer');
  $resetButton.classList.remove('disabled');

  game.start();
};

const handleResetButtonClick = () => {
  if (!game.isGamePlaying) return;

  $startButton.classList.add('pointer');
  $startButton.classList.remove('disabled');
  $resetButton.classList.remove('pointer');
  $resetButton.classList.add('disabled');

  game.reset();
};

$startButton.addEventListener('click', handleStartButtonClick);
$resetButton.addEventListener('click', handleResetButtonClick);
