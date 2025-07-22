import { validatePieceMovement } from './pieceMovement';

/**
 * Initializes a new chess board with pieces in starting positions
 * @returns {Object} Initial game state with board and current player
 */
export const initializeBoard = () => {
  const board = Array(8).fill().map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
  }
  
  // Set up other pieces
  const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  pieceOrder.forEach((type, col) => {
    board[0][col] = { type, color: 'black' };
    board[7][col] = { type, color: 'white' };
  });
  
  return {
    board,
    currentPlayer: 'white',
    selectedPiece: null,
  };
};

/**
 * Validates if a move is legal
 * @param {Object} gameState Current game state
 * @param {Object} from Starting position {row, col}
 * @param {Object} to Target position {row, col}
 * @returns {boolean} True if move is valid
 */
export const isValidMove = (gameState, from, to) => {
  const { board, currentPlayer } = gameState;
  const piece = board[from.row][from.col];
  
  // Basic validation
  if (!piece || piece.color !== currentPlayer) return false;
  if (from.row === to.row && from.col === to.col) return false;
  
  // Check if destination has a piece of the same color
  const destinationPiece = board[to.row][to.col];
  if (destinationPiece && destinationPiece.color === currentPlayer) return false;
  
  // Piece-specific movement validation
  return validatePieceMovement(piece, from, to, board);
};

/**
 * Executes a move and returns new game state
 * @param {Object} gameState Current game state
 * @param {Object} from Starting position {row, col}
 * @param {Object} to Target position {row, col}
 * @returns {Object} New game state
 */
export const makeMove = (gameState, from, to) => {
  const newBoard = gameState.board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  
  // Move the piece
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  
  return {
    board: newBoard,
    currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white',
    selectedPiece: null,
  };
};