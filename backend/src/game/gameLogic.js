export const WIN_COMBINATIONS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

export function checkWin(board) {
  for (const comb of WIN_COMBINATIONS) {
    const [a, b, c] = comb;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }
  return null;
}

export function isDraw(board) {
  return board.every(cell => cell !== null);
}
