import {
  GameRules,
  GameState,
  GameTileState,
  Move,
} from '@quinnturner/peg-game-engine';

import { Combination } from './combinatorics';

export function getAllPossibleMoves(
  rules: Readonly<GameRules>,
  board: readonly (readonly GameTileState[])[],
  state: GameState,
): Move[][] {
  if (
    state === GameState.PLAYER_ONE_WINS ||
    state === GameState.PLAYER_TWO_WINS
  ) {
    return [];
  }
  const {
    adjacentRequired,
    maxNumOfPegsCanTake,
    minNumOfPegsCanTake,
    xOnly,
  } = rules;

  // Conveniently, now we can use the moves array for determining which
  // pieces are occupied.
  const moves: Move[][] = [];

  const widthOfBoard = board[0].length;
  const heightOfBoard = board.length;

  // Start with only searching for one picks (if applicable).
  // This is to avoid the edge-case of double counting in the next loops.
  for (let y = 0; y < heightOfBoard; y++) {
    const allOnXAxis: number[] = [];
    for (let x = 0; x < widthOfBoard; x++) {
      if (board[y][x] === GameTileState.OCCUPIED) {
        allOnXAxis.push(x);
      }
    }
    for (let size = minNumOfPegsCanTake; size <= maxNumOfPegsCanTake; size++) {
      const combo = new Combination(allOnXAxis, size);
      let comboArr: Move[][] = combo
        .toArray()
        .map((move) => move!.map((x) => ({ x, y })));
      if (adjacentRequired) {
        // Remove non-adjacent
        comboArr = comboArr.filter((move) => {
          for (let i = 0; i < move.length - 1; i++) {
            if (move[i].x + 1 !== move[i + 1].x) {
              return false;
            }
          }
          return true;
        });
      }
      moves.push(...comboArr);
    }
  }

  if (!xOnly) {
    // Start with only searching for one picks (if applicable).
    // This is to avoid the edge-case of double counting in the next loops.
    for (let x = 0; x < widthOfBoard; x++) {
      const allOnYAxis: number[] = [];
      for (let y = 0; y < heightOfBoard; y++) {
        if (board[y][x] === GameTileState.OCCUPIED) {
          allOnYAxis.push(y);
        }
      }
      for (
        // Max because we have already done the singles
        let size = Math.max(minNumOfPegsCanTake, 2);
        size <= maxNumOfPegsCanTake;
        size++
      ) {
        const combo = new Combination(allOnYAxis, size);
        let comboArr: Move[][] = combo
          .toArray()
          .map((move) => move!.map((y) => ({ x, y })));

        if (adjacentRequired) {
          // Remove non-adjacent
          comboArr = comboArr.filter((move) => {
            for (let i = 0; i < move.length - 1; i++) {
              if (move[i].y + 1 !== move[i + 1].y) {
                return false;
              }
            }
            return true;
          });
        }
        moves.push(...comboArr);
      }
    }
  }

  return moves;
}
