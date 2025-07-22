// src/components/Square.jsx
import './Square.css';
import Piece from './Piece';

const Square = ({ row, col, piece, isSelected, onClick }) => {
  const isLight = (row + col) % 2 === 0;
  const squareColor = isLight ? 'light' : 'dark';
  const selectedClass = isSelected ? 'selected' : '';

  return (
    <div 
      className={`square ${squareColor} ${selectedClass}`}
      onClick={() => onClick(row, col)}
    >
      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
};

export default Square;