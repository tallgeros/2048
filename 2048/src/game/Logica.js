// ## /src/game/logic.js
export const GRID_SIZE = 4;

// 🔹 crea un tablero vacío
export function emptyBoard() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

// 🔹 clona un tablero
export function cloneBoard(board) {
  return board.map(row => row.slice());
}

// 🔹 inicializa tablero con 2 fichas
export function initBoard() {
  const board = emptyBoard();
  addRandomTile(board);
  addRandomTile(board);
  return board;
}

// 🔹 añade una ficha (2 o 4) en celda libre
export function addRandomTile(board) {
  const empty = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;

  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

export function rotateRight(board) {
  const newBoard = emptyBoard();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newBoard[c][GRID_SIZE - 1 - r] = board[r][c];
    }
  }
  return newBoard;
}

export function rotateLeft(board) {
  const newBoard = emptyBoard();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newBoard[GRID_SIZE - 1 - c][r] = board[r][c];
    }
  }
  return newBoard;
}

export function flipHorizontal(board) {
  return board.map((row) => row.slice().reverse());
}

export function canMove(board) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === 0) return true;
      const v = board[r][c];
      if (c < GRID_SIZE - 1 && board[r][c + 1] === v) return true;
      if (r < GRID_SIZE - 1 && board[r + 1][c] === v) return true;
    }
  }
  return false;
}

// 🔹 movimiento hacia la izquierda + merge
function moveLeft(board) {
  let moved = false;
  let scoreGainTotal = 0;
  const newBoard = emptyBoard();

  for (let r = 0; r < GRID_SIZE; r++) {
    let row = board[r].filter(v => v !== 0);
    let newRow = [];
    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        newRow.push(row[i] * 2);
        scoreGainTotal += row[i] * 2;
        i++;
        moved = true;
      } else {
        newRow.push(row[i]);
      }
    }
    while (newRow.length < GRID_SIZE) newRow.push(0);
    newBoard[r] = newRow;
    if (newRow.toString() !== board[r].toString()) moved = true;
  }
  return { board: newBoard, moved, scoreGainTotal };
}

export function move(board, direction) {
  let newBoard = cloneBoard(board);
  let moved = false;
  let scoreGain = 0;

  if (direction === 'left') {
    const res = moveLeft(newBoard);
    newBoard = res.board;
    moved = res.moved;
    scoreGain = res.scoreGainTotal;
  } else if (direction === 'right') {
    newBoard = flipHorizontal(newBoard);
    const res = moveLeft(newBoard);
    newBoard = flipHorizontal(res.board);
    moved = res.moved;
    scoreGain = res.scoreGainTotal;
  } else if (direction === 'up') {
    newBoard = rotateLeft(newBoard);
    const res = moveLeft(newBoard);
    newBoard = rotateRight(res.board);
    moved = res.moved;
    scoreGain = res.scoreGainTotal;
  } else if (direction === 'down') {
    newBoard = rotateRight(newBoard);
    const res = moveLeft(newBoard);
    newBoard = rotateLeft(res.board);
    moved = res.moved;
    scoreGain = res.scoreGainTotal;
  }

  return { board: newBoard, moved, scoreGain };
}

// 🔹 convierte tablero en lista de tiles
export function boardToTiles(board) {
  const tiles = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const v = board[r][c];
      if (v !== 0) {
        tiles.push({
          key: `${r}-${c}-${v}-${Math.random().toString(36).slice(2, 9)}`,
          row: r,
          col: c,
          value: v
        });
      }
    }
  }
  return tiles;
}