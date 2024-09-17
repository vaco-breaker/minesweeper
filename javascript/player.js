import { SVG_COLLECTION } from './svgCollection.js';

export default class Player {
  constructor(board) {
    this.clickedBoard = Array.from(Array(9), () => Array(9).fill(''));
    this.board = board;
    this.svgCollection = SVG_COLLECTION;
  }

  clickLeftGameBoardCell = (e) => {
    e.target.classList.add('flipped');

    const [yIndex, xIndex] = e.target.dataset.index.split(',').map(Number);

    if (this.board[yIndex][xIndex] === 'mine') {
      e.target.innerHTML = this.svgCollection.mineImg;
    } else if (this.board[yIndex][xIndex] !== '') {
      e.target.innerHTML = this.board[yIndex][xIndex];
    }
  };

  clickRightGameBoardCell = (e) => {
    e.preventDefault();

    e.target.innerHTML = this.svgCollection.flagImg;
  };
}
