import Player from './player.js';
import { SVG_COLLECTION } from './svgCollection.js';
import { createAroundArray } from './utils.js';

export default class Game {
  constructor() {
    this.board = Array.from(Array(9), () => Array(9).fill(''));
    this.$timer = document.querySelector('#timer');
    this.$gameBoard = document.querySelector('#gameBoard');
    this.$flagNumber = document.querySelector('#flagNumber');
    this.svgCollection = SVG_COLLECTION;
    this.timeLeft = 100;
    this.timeId = null;
    this.flagNumber = 10;
    this.mineArray = [];
    this.isGamePlaying = false;

    this.player = new Player(this.board, this.flagNumber);
  }

  start() {
    this.isGamePlaying = true;
    this.$flagNumber.innerHTML = 10;

    this.#createGameBoard();
    this.#timerStart();

    this.$gameBoard.addEventListener('click', this.player.clickLeftGameBoardCell);
    this.$gameBoard.addEventListener('contextmenu', this.player.clickRightGameBoardCell);
  }

  reset() {
    this.isGamePlaying = false;

    clearInterval(this.timeId);
    this.timeId = null;
    this.timeLeft = 100;
    this.$timer.textContent = `${this.timeLeft}`;
    this.flagNumber = 10;

    this.board = Array.from(Array(9), () => Array(9).fill(''));
    this.mineArray = [];

    this.$gameBoard.innerHTML = '';
    this.$flagNumber.innerHTML = this.svgCollection.flagImg;

    this.$gameBoard.removeEventListener('click', this.player.clickLeftGameBoardCell);
    this.$gameBoard.removeEventListener('contextmenu', this.player.clickRightGameBoardCell);

    this.player = new Player(this.board, this.flagNumber);
  }

  #timerStart() {
    this.timeId = setInterval(() => {
      this.timeLeft--;
      this.$timer.textContent = `${this.timeLeft}`;

      if (this.timeLeft === 0) {
        alert('시간 초과!');
        clearInterval(this.timeId);
        this.timeLeft = 100;
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
    const aroundMineArray = createAroundArray(yIndex, xIndex, this.board.length);

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
}
