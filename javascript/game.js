export default class Game {
  constructor() {
    this.board = Array(9).fill(Array(9).fill(0));
    this.$timer = document.querySelector('#timer');
    this.$gameBoard = document.querySelector('#gameBoard');
    this.timeLeft = 999;
    this.timeId = null;
  }

  start() {
    this.#createGameBoard();
    this.#timerStart();

    this.$gameBoard.addEventListener('click', this.clickGameBoardCell);
  }

  #timerStart() {
    this.timeId = setInterval(() => {
      this.timeLeft--;
      this.$timer.textContent = `${this.timeLeft}`;

      if (this.timeLeft === 0) {
        alert('시간 초과!');
        clearInterval(this.timeId);
        this.timeLeft = 999;
      }
    }, 1000);
  }

  #createGameBoard() {
    this.board.forEach((row, yIndex) => {
      row.forEach((cell, xIndex) => {
        const newElement = document.createElement('div');
        newElement.classList.add('cell');
        newElement.dataset.index = `${[xIndex, this.board.length - yIndex - 1]}`;
        newElement.textContent = 0;
        this.$gameBoard.appendChild(newElement);
      });
    });
  }

  clickGameBoardCell = (e) => {
    e.target.classList.add('flipped');
  };
}
