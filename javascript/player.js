import { SVG_COLLECTION } from './svgCollection.js';

export default class Player {
  constructor(board) {
    this.clickedBoard = Array.from(Array(9), () => Array(9).fill(''));
    this.board = board;
    this.svgCollection = SVG_COLLECTION;
  }

  clickLeftGameBoardCell = (e) => {
    e.target.classList.add('flipped');

    const [xIndex, yIndex] = e.target.dataset.index.split(',');
    const [xIndexForBoard, yIndexForBoard] = [this.board.length - yIndex - 1, Number(xIndex)];

    if (this.board[xIndexForBoard][yIndexForBoard] === 'mine') {
      e.target.innerHTML = this.svgCollection.mineImg;
    } else if (this.board[xIndexForBoard][yIndexForBoard] !== '') {
      e.target.innerHTML = this.board[xIndexForBoard][yIndexForBoard];
    }
  };

  clickRightGameBoardCell = (e) => {
    e.preventDefault();

    e.target.innerHTML = this.svgCollection.flagImg;
  };
}
