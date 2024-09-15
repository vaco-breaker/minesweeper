import { SVG_COLLECTION } from './svgCollection.js';

export default class Game {
  constructor() {
    this.board = Array.from(Array(9), () => Array(9).fill(''));
    this.$timer = document.querySelector('#timer');
    this.$gameBoard = document.querySelector('#gameBoard');
    this.svgCollection = SVG_COLLECTION;
    this.timeLeft = 999;
    this.timeId = null;
    this.mineArray = [];
  }

  start() {
    this.#createGameBoard();
    this.#timerStart();

    this.$gameBoard.addEventListener('click', this.clickLeftGameBoardCell);
    this.$gameBoard.addEventListener('contextmenu', this.clickRightGameBoardCell);
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
        newElement.textContent = '';
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
        if (cell.dataset.index === `${[xIndex, this.board.length - yIndex - 1]}`) {
          cell.innerHTML = this.svgCollection.mineImg;
        }
      });

      Array.from($allCell).forEach((cell) => {
        this.#countMineNumber(cell, yIndex, xIndex);
      });
    });
  }

  #countMineNumber(cell, yIndex, xIndex) {
    const aroundMineArray = this.#createAroundMineArray(yIndex, xIndex);

    for (let i = 0; i < aroundMineArray.length; i++) {
      if (cell.dataset.index === `${aroundMineArray[i]}` && !cell.innerHTML.includes('svg')) {
        cell.textContent = Number(cell.textContent) + 1;
        this.board[this.board.length - 1 - aroundMineArray[i][1]][aroundMineArray[i][0]] =
          Number(this.board[this.board.length - 1 - aroundMineArray[i][1]][aroundMineArray[i][0]]) +
          1;
      }
    }
  }

  #createAroundMineArray(y, x) {
    const aroundMineArray = [
      [x - 1, this.board.length - y - 1 - 1],
      [x - 1, this.board.length - y - 1],
      [x - 1, this.board.length - y - 1 + 1],
      [x, this.board.length - y - 1 - 1],
      [x, this.board.length - y - 1 + 1],
      [x + 1, this.board.length - y - 1 - 1],
      [x + 1, this.board.length - y - 1],
      [x + 1, this.board.length - y - 1 + 1],
    ];

    return aroundMineArray;
  }

  clickLeftGameBoardCell = (e) => {
    e.target.classList.add('flipped');
  };

  clickRightGameBoardCell = (e) => {
    e.preventDefault();

    e.target.innerHTML = this.svgCollection.flagImg;
  };
}
