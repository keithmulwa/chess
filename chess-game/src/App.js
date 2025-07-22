import { useState } from 'react';
import Board from './components/Board';
import { initializeBoard, isValidMove, makeMove } from './utils/gameLogic';
import './App.css';

function App() {
  const [gameState, setGameState] = useState(initializeBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);

  const handleSquareClick = (row, col) => {
    // If no piece is selected and the clicked square has a piece of the current player's color
    if (!selectedSquare && gameState.board[row][col]?.color === gameState.currentPlayer) {
      setSelectedSquare({ row, col });
      return;
    }
    
    // If a piece is already selected
    if (selectedSquare) {
      // If clicking on the same piece, deselect it
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }
      
      // If clicking on another piece of the same color, select that piece instead
      const clickedPiece = gameState.board[row][col];
      if (clickedPiece?.color === gameState.currentPlayer) {
        setSelectedSquare({ row, col });
        return;
      }
      
      // Check if the move is valid
      if (isValidMove(gameState, selectedSquare, { row, col })) {
        setGameState(makeMove(gameState, selectedSquare, { row, col }));
        setSelectedSquare(null);
      }
    }
  };

  const resetGame = () => {
    setGameState(initializeBoard());
    setSelectedSquare(null);
  };

  return (
    <div className="chess-game">
      <h1>Chess Game</h1>
      <div className="game-info">
        <div className="turn-indicator">
          Current turn: <span className={gameState.currentPlayer}>{gameState.currentPlayer}</span>
        </div>
        <button onClick={resetGame} className="reset-button">
          Reset Game
        </button>
      </div>
      <Board 
        board={gameState.board} 
        selectedSquare={selectedSquare}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
}

export default App;