const $mainTag = document.querySelector('main');
const $flagNumber = document.querySelector('#flagNumber');
const $resetButton = document.querySelector('#resetButton');
const $timer = document.querySelector('#timer');
const $gameBoard = document.querySelector('#gameBoard');

class Game {
  constructor() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.timeLeft = 999;
    this.timeId = null;
  }

  start() {
    this.createGameBoard();
    this.timerStart();
  }

  timerStart() {
    this.timeId = setInterval(() => {
      timeLeft--;
      $timer.textContent = `${timeLeft}`;
      if (timeLeft === 0) {
        alert('시간 초과!');
        clearInterval(this.timeId);
        this.timeLeft = 999;
      }
    }, 1000);
  }

  createGameBoard() {}
}
