import React from 'react';
import './scoreBoard.css';

export default function ScoreBoard({ score, best }) {
  return (
    <div className="scoreboard-container">
      <div className="scoreboard-box">
        <span className="scoreboard-label">Puntuación</span>
        <span className="scoreboard-value">{score}</span>
      </div>
      <div className="scoreboard-box">
        <span className="scoreboard-label">Mejor</span>
        <span className="scoreboard-value">{best}</span>
      </div>
    </div>
  );
}