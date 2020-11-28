import GameTileState from './game-tile-state';

// gameTiles[y][x]
// This is the "base game"
export const boardTrapezoid5x3: GameTileState[][] = [
  [1, 1, 1, 1, 1],
  [3, 1, 1, 1, 1],
  [3, 3, 1, 1, 1],
];

// losing as first player
export const boardSquareWithPoint4x3: GameTileState[][] = [
  [3, 1, 1, 1],
  [1, 1, 1, 1],
  [3, 1, 1, 1],
];

export const boardTriangle2x2: GameTileState[][] = [
  [1, 1],
  [3, 1],
];

export const boardP3x2: GameTileState[][] = [
  [1, 1, 1],
  [3, 1, 1],
];

export const boardL3x2: GameTileState[][] = [
  [1, 1, 1],
  [3, 3, 1],
];

export const boardTriangle3x3: GameTileState[][] = [
  [1, 1, 1],
  [3, 1, 1],
  [3, 3, 1],
];

export const boardTriangle5x5: GameTileState[][] = [
  [1, 1, 1, 1, 1],
  [3, 1, 1, 1, 1],
  [3, 3, 1, 1, 1],
  [3, 3, 3, 1, 1],
  [3, 3, 3, 3, 1],
];

export const boardCircle3x3: GameTileState[][] = [
  [1, 1, 1],
  [1, 3, 1],
  [1, 1, 1],
];
