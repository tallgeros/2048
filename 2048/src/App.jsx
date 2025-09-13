import React, { useState } from 'react';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import { move, addRandomTile, canMove, initBoard, boardToTiles } from './game/Logica';
import './App.css';

export default function App() {
  const [board, setBoard] = useState(initBoard());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  // 🔹 reinicia el juego
  function restart() {
    const newBoard = initBoard();
    setBoard(newBoard);
    setScore(0);
  }

  // 🔹 maneja el movimiento de fichas
  function handleMove(direction) {
    const res = move(board, direction);
    if (!res.moved) return;
    const newBoard = res.board;
    addRandomTile(newBoard);
    const newScore = score + res.scoreGain;
    setBoard(newBoard);
    setScore(newScore);
    if (newScore > best) setBest(newScore);

    if (!canMove(newBoard)) {
      const shouldRestart = window.confirm(`Game Over! Tu puntuación: ${newScore}\n¿Quieres reiniciar?`);
      if (shouldRestart) {
        restart();
      }
    }
  }

  return (
    <div className= "container">
      <div className= "app">
        <ScoreBoard score={score} best={best} />
        <div className= "spacer" />
        <Board tiles={boardToTiles(board)} onMove={handleMove} onRestart={restart} />
      </div>
    </div>
  );
}
