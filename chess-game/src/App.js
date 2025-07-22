import { useState, useEffect } from 'react';
import Board from './components/Board';
import { initializeBoard, isValidMove, makeMove } from './utils/gameLogic';
import { makeAIMove } from './utils/ai';
import './App.css';

function App() {
  const [gameState, setGameState] = useState(initializeBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [gameStatus, setGameStatus] = useState('ongoing');
  const [moveHistory, setMoveHistory] = useState([]);

  // Handle AI moves
  useEffect(() => {
    if (aiEnabled && gameState.currentPlayer === 'black' && gameStatus === 'ongoing') {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(gameState);
        if (aiMove) {
          const newState = makeMove(gameState, aiMove.from, aiMove.to);
          setGameState(newState);
          setMoveHistory([...moveHistory, {
            player: 'black',
            move: `${String.fromCharCode(97+aiMove.from.col)}${8-aiMove.from.row} → ${String.fromCharCode(97+aiMove.to.col)}${8-aiMove.to.row}`,
            piece: gameState.board[aiMove.from.row][aiMove.from.col].type
          }]);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, aiEnabled]);

  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'ongoing') return;
    if (aiEnabled && gameState.currentPlayer === 'black') return;

    // If no piece selected and clicked square has current player's piece
    if (!selectedSquare && gameState.board[row][col]?.color === gameState.currentPlayer) {
      setSelectedSquare({ row, col });
      return;
    }

    // If piece already selected
    if (selectedSquare) {
      // Clicked same square - deselect
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }

      // Clicked another piece of same color - select that instead
      const clickedPiece = gameState.board[row][col];
      if (clickedPiece?.color === gameState.currentPlayer) {
        setSelectedSquare({ row, col });
        return;
      }

      // Validate and make move
      if (isValidMove(gameState, selectedSquare, { row, col })) {
        const newState = makeMove(gameState, selectedSquare, { row, col });
        setGameState(newState);
        setSelectedSquare(null);
        
        // Add to move history
        setMoveHistory([...moveHistory, {
          player: 'white',
          move: `${String.fromCharCode(97+selectedSquare.col)}${8-selectedSquare.row} → ${String.fromCharCode(97+col)}${8-row}`,
          piece: gameState.board[selectedSquare.row][selectedSquare.col].type
        }]);
      }
    }
  };

  const resetGame = () => {
    setGameState(initializeBoard());
    setSelectedSquare(null);
    setGameStatus('ongoing');
    setMoveHistory([]);
  };

  const toggleAI = () => {
    setAiEnabled(!aiEnabled);
    if (!aiEnabled && gameState.currentPlayer === 'black') {
      // If enabling AI and it's black's turn, make AI move immediately
      const aiMove = makeAIMove(gameState);
      if (aiMove) {
        setTimeout(() => {
          setGameState(makeMove(gameState, aiMove.from, aiMove.to));
        }, 100);
      }
    }
  };

  return (
    <div className="chess-game">
      <h1>Chess Game</h1>
      
      <div className="game-controls">
        <button onClick={resetGame} className="control-button">
          New Game
        </button>
        <button 
          onClick={toggleAI} 
          className={`control-button ${aiEnabled ? 'active' : ''}`}
        >
          {aiEnabled ? 'AI: ON' : 'AI: OFF'}
        </button>
      </div>

      <div className="game-status">
        <div className={`turn-indicator ${gameState.currentPlayer}`}>
          {gameStatus === 'ongoing' 
            ? `Current turn: ${gameState.currentPlayer}` 
            : `Game over: ${gameStatus}`}
        </div>
      </div>

      <div className="game-container">
        <Board 
          board={gameState.board} 
          selectedSquare={selectedSquare}
          onSquareClick={handleSquareClick}
        />

        <div className="move-history">
          <h3>Move History</h3>
          <div className="history-list">
            {moveHistory.length > 0 ? (
              moveHistory.map((item, index) => (
                <div key={index} className={`history-item ${item.player}`}>
                  <span className="move-number">{index + 1}.</span>
                  <span className="piece-icon">{getPieceSymbol(item.piece, item.player)}</span>
                  <span className="move-text">{item.move}</span>
                </div>
              ))
            ) : (
              <div className="empty-history">No moves yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to display piece symbols in move history
function getPieceSymbol(type, color) {
  const symbols = {
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    knight: { white: '♘', black: '♞' },
    pawn: { white: '♙', black: '♟' },
  };
  return symbols[type][color];
}

export default App;