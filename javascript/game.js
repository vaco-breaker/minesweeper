import { SVG_COLLECTION } from './svgCollection.js';
import Player from './player.js';

export default class Game {
  constructor() {
    this.board = Array.from(Array(9), () => Array(9).fill(''));
    this.$timer = document.querySelector('#timer');
    this.$gameBoard = document.querySelector('#gameBoard');
    this.svgCollection = SVG_COLLECTION;
    this.timeLeft = 999;
    this.timeId = null;
    this.mineArray = [];

    this.player = new Player(this.board);
  }

  start() {
    this.#createGameBoard();
    this.#timerStart();

    this.$gameBoard.addEventListener('click', this.player.clickLeftGameBoardCell);
    this.$gameBoard.addEventListener('contextmenu', this.player.clickRightGameBoardCell);
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
        newElement.dataset.index = `${[yIndex, xIndex]}`;
        this.$gameBoard.appendChild(newElement);
      });
    });

    this.#createMine();
  }

  #createMine() {
    while (this.mineArray.length < 10) {
      const newMine = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
      let mineCheckFlag = false;

      this.mineArray.forEach((mine) => {
        if (mine[0] === newMine[0] && mine[1] === newMine[1]) mineCheckFlag = true;
      });

      if (mineCheckFlag === false) {
        this.mineArray.push(newMine);
        this.board[newMine[0]][newMine[1]] = 'mine';
      }
    }

    this.mineArray.forEach((value) => {
      const [yIndex, xIndex] = value;
      const $allCell = document.querySelectorAll('.cell');

      Array.from($allCell).forEach((cell) => {
        this.#countMineNumber(cell, yIndex, xIndex);
      });
    });
  }

  #countMineNumber(cell, yIndex, xIndex) {
    const aroundMineArray = this.#createAroundMineArray(yIndex, xIndex);

    for (let i = 0; i < aroundMineArray.length; i++) {
      const oneOfAroundMine =
        this.board[aroundMineArray[i][0]][aroundMineArray[i][1]] === 'mine'
          ? 'mine'
          : Number(this.board[aroundMineArray[i][0]][aroundMineArray[i][1]]);

      if (cell.dataset.index === `${aroundMineArray[i]}` && oneOfAroundMine !== 'mine') {
        this.board[aroundMineArray[i][0]][aroundMineArray[i][1]] = oneOfAroundMine + 1;
      }
    }
  }

  #createAroundMineArray(y, x) {
    const aroundMineArray = [
      [y - 1, x - 1],
      [y - 1, x],
      [y - 1, x + 1],
      [y, x - 1],
      [y, x + 1],
      [y + 1, x - 1],
      [y + 1, x],
      [y + 1, x + 1],
    ];

    return aroundMineArray.filter(
      (coordinate) =>
        0 <= coordinate[0] &&
        coordinate[0] < this.board.length &&
        0 <= coordinate[1] &&
        coordinate[1] < this.board.length,
    );
  }
}
