import { SVG_COLLECTION } from './svgCollection.js';
import { createCrossDirectionArray } from './utils.js';

export default class Player {
  constructor(board, flagNumber) {
    this.clickedBoard = Array.from(Array(9), () => Array(9).fill(null));
    this.flagMap = Array.from(Array(9), () => Array(9).fill(null));
    this.board = board;
    this.flagNumber = flagNumber;
    this.flagStack = [];
    this.svgCollection = SVG_COLLECTION;
  }

  clickLeftGameBoardCell = (e) => {
    if (e.target.innerHTML) return;

    e.target.classList.add('flipped');

    const [yIndex, xIndex] = e.target.dataset.index.split(',').map(Number);

    if (this.board[yIndex][xIndex] === 'mine') {
      e.target.innerHTML = this.svgCollection.mineImg;
      this.clickedBoard[yIndex][xIndex] = 'mine';
    } else if (this.board[yIndex][xIndex] !== '') {
      e.target.innerHTML = this.board[yIndex][xIndex];
      this.clickedBoard[yIndex][xIndex] = this.board[yIndex][xIndex];
    } else {
      let numZeroChain = 0;
      this.#searchZero(yIndex, xIndex, numZeroChain);

      const $allCell = document.querySelectorAll('.cell');
      Array.from($allCell).forEach((cell) => {
        const [yIndex, xIndex] = cell.dataset.index.split(',').map(Number);

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

  clickRightGameBoardCell = (e) => {
    e.preventDefault();

    console.dir(e.target, e.currentTarget);

    if (this.flagNumber === 0) {
      return;
    }

    if (Array.from(e.target.classList).includes('flipped')) {
      return;
    }

    // if (e.target.innerHTML.includes('svg')) {
    //   e.target.innerHTML = '';
    //   this.flagNumber++;

    //   const [yIndex, xIndex] = e.target.dataset.index.split(',').map(Number);
    //   this.flagMap[yIndex][xIndex] = null;
    // } else {
    //   e.target.innerHTML = this.svgCollection.flagImg;
    //   this.flagNumber--;

    //   const [yIndex, xIndex] = e.target.dataset.index.split(',').map(Number);
    //   this.flagMap[yIndex][xIndex] = 'flagged';
    // }
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
}
