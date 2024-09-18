import { SVG_COLLECTION } from './svgCollection.js';
import { createAroundArray, createTwoDimensionalArray } from './utils.js';

export default class Game {
  constructor() {
    this.board = createTwoDimensionalArray(9, '');
    this.$timer = document.querySelector('#timer');
    this.$gameBoard = document.querySelector('#gameBoard');
    this.$flagNumber = document.querySelector('#flagNumber');
    this.$loseModal = document.querySelector('#loseModalWrapper');
    this.$winModal = document.querySelector('#winModalWrapper');

    this.svgCollection = SVG_COLLECTION;
    this.timeLeft = 100;
    this.timerId = { id: null };
    this.flagNumber = 10;
    this.mineArray = [];
    this.isGamePlaying = false;

    this.player = null;
  }

  start(player) {
    this.isGamePlaying = true;
    this.$flagNumber.innerHTML = 10;

    this.#createGameBoard();
    this.#timerStart();

    this.player = player;

    this.$loseModal = document.querySelector('#loseModalWrapper');
    this.$winModal = document.querySelector('#winModalWrapper');

    this.$gameBoard.addEventListener('click', this.player.handleGameBoardCellLeftClick);
    this.$gameBoard.addEventListener('contextmenu', this.player.handleGameBoardCellRightClick);
    this.$loseModal.addEventListener('click', this.player.handleClickLoseModal, { once: true });
    this.$winModal.addEventListener('click', this.player.handleClickWinModal, { once: true });
  }

  reset() {
    this.isGamePlaying = false;

    this.$gameBoard.removeEventListener('click', this.player.handleGameBoardCellLeftClick);
    this.$gameBoard.removeEventListener('contextmenu', this.player.handleGameBoardCellRightClick);

    this.player = null;

    clearInterval(this.timerId.id);
    this.timerId = { id: null };
    this.timeLeft = 100;
    this.$timer.textContent = `${this.timeLeft}`;
    this.flagNumber = 10;

    this.board = createTwoDimensionalArray(9, '');
    this.mineArray = [];

    this.$gameBoard.innerHTML = `
      <div id="loseModalWrapper" class="invisible modal lose-modal">
        <img src="assets/images/gameOver.png" alt="게임 오버 이미지">
      </div>
      <div id="winModalWrapper" class="invisible modal win-modal">
        <img src="assets/images/win.png" alt="게임 승리 이미지">
      </div>
    `;
    this.$gameBoard.classList.remove('border');
    this.$flagNumber.innerHTML = this.svgCollection.flagImg;
  }

  #timerStart() {
    this.timerId.id = setInterval(() => {
      this.timeLeft--;
      this.$timer.textContent = `${this.timeLeft}`;

      if (this.timeLeft === 0) {
        this.lose();
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
        this.$gameBoard.classList.add('border');
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

  lose() {
    const handleGameBoardCellLeftClick =
      this.constructor.name === 'Game'
        ? this.player.handleGameBoardCellLeftClick
        : this.handleGameBoardCellLeftClick;
    const handleGameBoardCellRightClick =
      this.constructor.name === 'Game'
        ? this.player.handleGameBoardCellRightClick
        : this.handleGameBoardCellRightClick;

    this.$gameBoard.removeEventListener('click', handleGameBoardCellLeftClick);
    this.$gameBoard.removeEventListener('contextmenu', handleGameBoardCellRightClick);
    this.$loseModal.classList.remove('invisible');

    const $allCell = document.querySelectorAll('.cell');
    Array.from($allCell).forEach((cell) => {
      cell.classList.add('pointer-unset');
    });

    clearInterval(this.timerId.id);
  }
}
