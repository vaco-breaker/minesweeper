import { SVG_COLLECTION } from './svgCollection.js';

export default class Player {
  constructor(board) {
    this.clickedBoard = Array.from(Array(9), () => Array(9).fill(''));
    this.board = board;
    this.svgCollection = SVG_COLLECTION;
  }

  searchingNumberZero(x, y) {
    const queue = [[x, y]];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    const cellsToFlip = [];

    while (queue.length > 0) {
      const [xIndex, yIndex] = queue.shift();

      if (this.clickedBoard[xIndex][yIndex] === 'mark') continue;
      this.clickedBoard[xIndex][yIndex] = 'mark';

      if (this.board[xIndex][yIndex] === '') {
        cellsToFlip.push([xIndex, yIndex]);

        for (const [dx, dy] of directions) {
          const newX = xIndex + dx;
          const newY = yIndex + dy;

          if (newX >= 0 && newY >= 0 && newX < this.board.length && newY < this.board[0].length) {
            if (this.clickedBoard[newX][newY] !== 'mark') {
              queue.push([newX, newY]);
            }
          }
        }
      }
    }
    return cellsToFlip;
  }

  clickLeftGameBoardCell = (e) => {
    e.target.classList.add('flipped');

    const [xIndex, yIndex] = e.target.dataset.index.split(',');
    const [xIndexForBoard, yIndexForBoard] = [this.board.length - yIndex - 1, Number(xIndex)];

    if (this.board[xIndexForBoard][yIndexForBoard] === 'mine') {
      e.target.innerHTML = this.svgCollection.mineImg;
    } else if (this.board[xIndexForBoard][yIndexForBoard] !== '') {
      e.target.innerHTML = this.board[xIndexForBoard][yIndexForBoard];
    } else if (this.board[xIndexForBoard][yIndexForBoard] === '') {
      const showZero = this.searchingNumberZero(xIndexForBoard, yIndexForBoard);
    }
  };

  clickRightGameBoardCell = (e) => {
    e.preventDefault();

    e.target.innerHTML = this.svgCollection.flagImg;
  };
}
