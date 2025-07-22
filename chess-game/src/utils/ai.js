// src/utils/ai.js
import { isValidMove } from './gameLogic';

// Piece values for basic evaluation
const PIECE_VALUES = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  rook: 50,
  queen: 90,
  king: 900
};

// Evaluate a board position from Black's perspective
const evaluateBoard = (board) => {
  let score = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = PIECE_VALUES[piece.type];
        // Black pieces add to score, white pieces subtract
        score += piece.color === 'black' ? value : -value;
      }
    }
  }
  
  return score;
};

// Get all possible moves for a player
const getAllPossibleMoves = (gameState, player) => {
  const { board } = gameState;
  const moves = [];
  
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece.color === player) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(gameState, { row: fromRow, col: fromCol }, { row: toRow, col: toCol })) {
              moves.push({
                from: { row: fromRow, col: fromCol },
                to: { row: toRow, col: toCol },
                piece: piece.type
              });
            }
          }
        }
      }
    }
  }
  
  return moves;
};

// Simulate a move and return new game state
const simulateMove = (gameState, move) => {
  const newBoard = gameState.board.map(row => [...row]);
  const piece = newBoard[move.from.row][move.from.col];
  
  newBoard[move.to.row][move.to.col] = piece;
  newBoard[move.from.row][move.from.col] = null;
  
  return {
    board: newBoard,
    currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white'
  };
};

// Basic AI that considers captures and piece values
export const makeAIMove = (gameState) => {
  const possibleMoves = getAllPossibleMoves(gameState, 'black');
  if (possibleMoves.length === 0) return null;

  // Find all capturing moves
  const capturingMoves = possibleMoves.filter(move => {
    const targetPiece = gameState.board[move.to.row][move.to.col];
    return targetPiece && targetPiece.color === 'white';
  });

  // If there are capturing moves, choose the most valuable capture
  if (capturingMoves.length > 0) {
    capturingMoves.sort((a, b) => {
      const aValue = gameState.board[a.to.row][a.to.col] 
        ? PIECE_VALUES[gameState.board[a.to.row][a.to.col].type] 
        : 0;
      const bValue = gameState.board[b.to.row][b.to.col] 
        ? PIECE_VALUES[gameState.board[b.to.row][b.to.col].type] 
        : 0;
      return bValue - aValue; // Sort descending
    });
    
    // Prefer capturing highest value piece
    return capturingMoves[0];
  }

  // If no captures, look for checks
  const checkingMoves = possibleMoves.filter(move => {
    const newState = simulateMove(gameState, move);
    // Simple check detection (does move attack opponent's king)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = newState.board[row][col];
        if (piece && piece.type === 'king' && piece.color === 'white') {
          return true;
        }
      }
    }
    return false;
  });

  if (checkingMoves.length > 0) {
    return checkingMoves[Math.floor(Math.random() * checkingMoves.length)];
  }

  // If no checks, look for developing moves (knights/bishops/queen)
  const developingMoves = possibleMoves.filter(move => 
    ['knight', 'bishop', 'queen'].includes(move.piece) &&
    move.from.row >= 6 && // Pieces in starting position
    move.to.row <= 5     // Moving toward center
  );

  if (developingMoves.length > 0) {
    return developingMoves[Math.floor(Math.random() * developingMoves.length)];
  }

  // Default: random move
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
};