import { SVG_COLLECTION } from './svgCollection.js';
import { createCrossDirectionArray, createTwoDimensionalArray, createIndexArray } from './utils.js';

export default class Player {
  constructor(board, flagNumber, loseFunc, timerId) {
    this.clickedBoard = createTwoDimensionalArray(9, null);
    this.flagMap = createTwoDimensionalArray(9, null);
    this.$gameBoard = document.querySelector('#gameBoard');
    this.$flagNumber = document.querySelector('#flagNumber');
    this.$loseModal = document.querySelector('#loseModalWrapper');
    this.$winModal = document.querySelector('#winModalWrapper');

    this.svgCollection = SVG_COLLECTION;
    this.board = board;
    this.flagNumber = flagNumber;
    this.loseFunc = loseFunc;
    this.timerId = timerId;
  }

  handleGameBoardCellLeftClick = (e) => {
    if (e.target.innerHTML || e.target.nodeName === 'path') return;

    e.target.classList.add('flipped');

    const [yIndex, xIndex] = createIndexArray(e.target);

    if (this.board[yIndex][xIndex] === 'mine') {
      e.target.innerHTML = this.svgCollection.mineImg;
      e.target.classList.add('mine-backgroundColor');

      this.loseFunc();
    } else if (this.board[yIndex][xIndex] !== '') {
      e.target.innerHTML = this.board[yIndex][xIndex];
      this.clickedBoard[yIndex][xIndex] = this.board[yIndex][xIndex];
    } else {
      this.#searchZero(yIndex, xIndex);

      const $allCell = document.querySelectorAll('.cell');
      Array.from($allCell).forEach((cell) => {
        const [yIndex, xIndex] = createIndexArray(cell);

        if (this.clickedBoard[yIndex][xIndex] === '') {
          cell.classList.add('flipped');
        } else if (this.clickedBoard[yIndex][xIndex] !== null) {
          cell.classList.add('flipped');
          cell.innerHTML = this.clickedBoard[yIndex][xIndex];
        }
      });
    }

    this.#checkWin();
  };

  handleGameBoardCellRightClick = (e) => {
    e.preventDefault();

    if (Array.from(e.target.classList).includes('flipped')) {
      return;
    }

    if (
      e.target.innerHTML.includes('svg') ||
      e.target.nodeName === 'svg' ||
      e.target.nodeName === 'path'
    ) {
      if (e.target.nodeName === 'path') {
        const [yIndex, xIndex] = createIndexArray(e.target.parentNode.parentNode.parentNode);
        this.flagMap[yIndex][xIndex] = null;

        e.target.parentNode.parentNode.parentNode.innerHTML = '';
      } else if (e.target.nodeName === 'svg') {
        const [yIndex, xIndex] = createIndexArray(e.target.parentNode);
        this.flagMap[yIndex][xIndex] = null;

        e.target.parentNode.innerHTML = '';
      } else {
        const [yIndex, xIndex] = createIndexArray(e.target);
        this.flagMap[yIndex][xIndex] = null;

        e.target.innerHTML = '';
      }

      this.flagNumber++;
      this.$flagNumber.textContent = `${this.flagNumber}`;
    } else {
      if (this.flagNumber === 0) {
        return;
      }

      const [yIndex, xIndex] = createIndexArray(e.target);
      this.flagMap[yIndex][xIndex] = 'flagged';

      e.target.innerHTML = this.svgCollection.flagImg;
      this.flagNumber--;
      this.$flagNumber.textContent = `${this.flagNumber}`;
    }

    this.#checkWin();
  };

  handleClickLoseModal = () => {
    this.$loseModal.classList.add('invisible');
  };

  handleClickWinModal = () => {
    this.$winModal.classList.add('invisible');
  };

  #searchZero(yIndex, xIndex) {
    const BOARD_LENGTH = this.board.length;
    const queue = [[yIndex, xIndex]];
    const isHaveCheckedArray = createTwoDimensionalArray(9, false);
    this.clickedBoard[yIndex][xIndex] = '';

    while (queue.length) {
      const [y, x] = queue.shift();

      const crossDirectionArray = createCrossDirectionArray(y, x);

      for (let i = 0; i < 4; i++) {
        const ny = crossDirectionArray[i][0];
        const nx = crossDirectionArray[i][1];

        if (ny < 0 || ny >= BOARD_LENGTH || nx < 0 || nx >= BOARD_LENGTH) {
          continue;
        } else if (isHaveCheckedArray[ny][nx]) {
          continue;
        }

        isHaveCheckedArray[ny][nx] = true;

        if (this.board[ny][nx] === 'mine') {
          continue;
        } else if (this.board[ny][nx] !== '') {
          this.clickedBoard[ny][nx] = this.board[ny][nx];

          continue;
        }

        this.clickedBoard[ny][nx] = '';

        queue.push([ny, nx]);
      }
    }
  }

  #checkWin() {
    if (this.flagNumber > 0) return;

    let nullNum = 0;
    let flagOnSpotNum = 0;

    this.clickedBoard.forEach((row, yIndex) => {
      row.forEach((value, xIndex) => {
        if (value === null) {
          nullNum++;
        }

        if (
          value === null &&
          this.flagMap[yIndex][xIndex] === 'flagged' &&
          this.board[yIndex][xIndex] === 'mine'
        ) {
          flagOnSpotNum++;
        }
      });
    });

    if (flagOnSpotNum === 10 && nullNum === 10) {
      this.#win();
    }
  }

  #win() {
    this.$gameBoard.removeEventListener('click', this.handleGameBoardCellLeftClick);
    this.$gameBoard.removeEventListener('contextmenu', this.handleGameBoardCellRightClick);
    this.$winModal.classList.remove('invisible');

    const $allCell = document.querySelectorAll('.cell');
    Array.from($allCell).forEach((cell) => {
      cell.classList.add('pointer-unset');
    });

    clearInterval(this.timerId.id);
  }
}
