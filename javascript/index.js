import Game from './game.js';
import Player from './player.js';

const $startButton = document.querySelector('#startButton');
const $resetButton = document.querySelector('#resetButton');

const game = new Game();

const handleStartButtonClick = () => {
  if (game.isGamePlaying) return;

  const player = new Player(game.board, game.flagNumber, game.lose, game.timerId);

  $startButton.classList.remove('pointer');
  $startButton.classList.add('disabled');
  $resetButton.classList.add('pointer');
  $resetButton.classList.remove('disabled');

  game.start(player);
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
