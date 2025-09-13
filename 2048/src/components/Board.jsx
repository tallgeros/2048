// src/components/Board.js
import React, { useState, useEffect } from 'react';
import './board.css';
import Tile from './Tile';
import { GRID_SIZE } from '../game/Logica-jsx';

const BOARD_PADDING = 8;      // 🔸 asegúrate que exista y esté bien escrito
const GAP = 6;
const MAX_BOARD_SIZE = 600;   // 🔸 límite máximo del tablero (px)

export default function Board({ tiles, onMove, onRestart }) {
  // Calcula tamaño inicial (protegemos SSR con typeof window)
  const getBoardSize = () => {
    if (typeof window === 'undefined') return MAX_BOARD_SIZE;
    return Math.min(window.innerWidth - BOARD_PADDING * 2, MAX_BOARD_SIZE);
  };

  const [boardSize, setBoardSize] = useState(getBoardSize);
  const cellSize = Math.floor((boardSize - GAP * (GRID_SIZE + 1)) / GRID_SIZE);

  // Actualiza el tamaño al redimensionar la ventana
  useEffect(() => {
    const handleResize = () => {
      setBoardSize(Math.min(window.innerWidth - BOARD_PADDING * 2, MAX_BOARD_SIZE));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manejo de gestos táctiles y mouse (igual que tenías)
  const handleStart = (event) => {
    const startX = event.touches ? event.touches[0].clientX : event.clientX;
    const startY = event.touches ? event.touches[0].clientY : event.clientY;

    const handleMove = (moveEvent) => {
      const currentX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const dx = currentX - startX;
      const dy = currentY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const minDist = 20;

      if (absDx < minDist && absDy < minDist) return;

      if (absDx > absDy) {
        onMove(dx > 0 ? 'right' : 'left');
      } else {
        onMove(dy > 0 ? 'down' : 'up');
      }

      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', cleanup);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', cleanup);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', cleanup);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', cleanup);
  };

  // Teclado
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onMove('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          onMove('down');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onMove('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          onMove('right');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onMove]);

  // Posiciones de tiles usando cellSize / GAP
  return (
    <div className="board-container">
      <div className="board-header">
        <h1 className="board-title">2048</h1>
        <button className="board-restart" onClick={onRestart}>Reiniciar</button>
      </div>

      <div
        className="board"
        style={{ width: boardSize, height: boardSize }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div className="board-grid" style={{ left: GAP, top: GAP }}>
          {Array.from({ length: GRID_SIZE }).map((_, r) => (
            <div
              key={`row-${r}`}
              className="board-row"
              style={{ marginBottom: r === GRID_SIZE - 1 ? 0 : GAP }}
            >
              {Array.from({ length: GRID_SIZE }).map((_, c) => (
                <div
                  key={`c-${r}-${c}`}
                  className="board-cell"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    marginRight: c === GRID_SIZE - 1 ? 0 : GAP,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {tiles.map((t) => {
          const left = t.col * (cellSize + GAP) + GAP;
          const top = t.row * (cellSize + GAP) + GAP;
          return (
            <Tile
              key={t.key}
              left={left}
              top={top}
              size={cellSize}
              value={t.value}
            />
          );
        })}
      </div>
    </div>
  );
}
