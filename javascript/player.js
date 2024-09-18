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
      let numZeroChain = 0;

      this.#searchZero(yIndex, xIndex, numZeroChain);

      const $allCell = document.querySelectorAll('.cell');
      Array.from($allCell).forEach((cell) => {
        const [yIndex, xIndex] = createIndexArray(cell);

        if (this.clickedBoard[yIndex][xIndex] === 'mine') {
          // 추후 지울 것, 어차피 mine 밟으면 게임 끝나있을테니
          cell.innerHTML = this.svgCollection.mineImg;
        } else if (this.clickedBoard[yIndex][xIndex] === '') {
          cell.classList.add('flipped');
        } else if (this.clickedBoard[yIndex][xIndex] !== null) {
          cell.classList.add('flipped');
          cell.innerHTML = this.clickedBoard[yIndex][xIndex];
        }
      });
    }
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
  };

  handleClickLoseModal = () => {
    this.$loseModal.classList.add('invisible');
  };

  handleClickWinModal = () => {
    this.$winModal.classList.add('invisible');
  };

  #searchZero(yIndex, xIndex, numZeroChain) {
    if (yIndex < 0 || yIndex >= this.board.length) return;
    if (xIndex < 0 || xIndex >= this.board.length) return;
    if (numZeroChain === 13) return;

    numZeroChain++;

    if (this.board[yIndex][xIndex] === 'mine') {
      return;
    } else if (this.board[yIndex][xIndex] !== '') {
      this.clickedBoard[yIndex][xIndex] = this.board[yIndex][xIndex];

      return;
    } else {
      const crossDirectionArray = createCrossDirectionArray(yIndex, xIndex);

      this.clickedBoard[yIndex][xIndex] = '';

      crossDirectionArray.forEach((coordinate) => {
        const [yIndex, xIndex] = coordinate;

        this.#searchZero(yIndex, xIndex, numZeroChain);
      });
    }
  }

  #checkWin() {}
}
