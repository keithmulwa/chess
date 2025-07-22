// src/components/Board.jsx
import Square from './Square';
import './Board.css';

const Board = ({ board, selectedSquare, onSquareClick }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((piece, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              piece={piece}
              isSelected={selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex}
              onClick={onSquareClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;