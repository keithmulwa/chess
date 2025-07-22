export const validatePieceMovement = (piece, from, to, board) => {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  
  switch (piece.type) {
    case 'pawn':
      // Basic pawn movement (without en passant or first double move)
      const direction = piece.color === 'white' ? -1 : 1;
      if (colDiff === 0) {
        // Moving forward
        if (to.row === from.row + direction && !board[to.row][to.col]) return true;
      } else if (colDiff === 1 && rowDiff === 1) {
        // Capturing diagonally
        return !!board[to.row][to.col] && board[to.row][to.col].color !== piece.color;
      }
      return false;
      
    case 'rook':
      return (rowDiff === 0 || colDiff === 0) && !isPathBlocked(from, to, board);
      
    case 'knight':
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
      
    case 'bishop':
      return rowDiff === colDiff && !isPathBlocked(from, to, board);
      
    case 'queen':
      return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && 
             !isPathBlocked(from, to, board);
             
    case 'king':
      return rowDiff <= 1 && colDiff <= 1;
      
    default:
      return false;
  }
};

const isPathBlocked = (from, to, board) => {
  const rowStep = from.row === to.row ? 0 : (to.row > from.row ? 1 : -1);
  const colStep = from.col === to.col ? 0 : (to.col > from.col ? 1 : -1);
  
  let row = from.row + rowStep;
  let col = from.col + colStep;
  
  while (row !== to.row || col !== to.col) {
    if (board[row][col]) return true;
    row += rowStep;
    col += colStep;
  }
  
  return false;
};