enum GameTileState {
  OCCUPIED = 1,
  VACANT = 2,
  // Imagine a board in the shape of an O. The middle of the O would have non-existent game tiles.
  NON_EXISTENT = 3,
}

export default GameTileState;
