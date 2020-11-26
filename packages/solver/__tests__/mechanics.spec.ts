import {
  boardTrapezoid5x3,
  GameRules,
  GameState,
  GameTileState,
} from '@quinnturner/peg-game-engine';

import { getAllPossibleMoves } from '../src/mechanics';

describe('getAllPossibleMoves', () => {
  it('handles x-and-y axis, adjacent-only on trapezoid 5x3 board', () => {
    const rules: GameRules = {
      adjacentRequired: true,
      minNumOfPegsCanTake: 1,
      maxNumOfPegsCanTake: 2,
      xOnly: false,
    };
    const moves = getAllPossibleMoves(
      rules,
      boardTrapezoid5x3,
      GameState.PLAYER_ONES_TURN,
    );
    // prettier-ignore
    const answer = JSON.stringify([
      [ { x: 0, y: 0 } ],
      [ { x: 1, y: 0 } ],
      [ { x: 2, y: 0 } ],
      [ { x: 3, y: 0 } ],
      [ { x: 4, y: 0 } ],
      [ { x: 0, y: 0 }, { x: 1, y: 0 } ],
      [ { x: 1, y: 0 }, { x: 2, y: 0 } ],
      [ { x: 2, y: 0 }, { x: 3, y: 0 } ],
      [ { x: 3, y: 0 }, { x: 4, y: 0 } ],
      [ { x: 1, y: 1 } ],
      [ { x: 2, y: 1 } ],
      [ { x: 3, y: 1 } ],
      [ { x: 4, y: 1 } ],
      [ { x: 1, y: 1 }, { x: 2, y: 1 } ],
      [ { x: 2, y: 1 }, { x: 3, y: 1 } ],
      [ { x: 3, y: 1 }, { x: 4, y: 1 } ],
      [ { x: 2, y: 2 } ],
      [ { x: 3, y: 2 } ],
      [ { x: 4, y: 2 } ],
      [ { x: 2, y: 2 }, { x: 3, y: 2 } ],
      [ { x: 3, y: 2 }, { x: 4, y: 2 } ],
      [ { x: 1, y: 0 }, { x: 1, y: 1 } ],
      [ { x: 2, y: 0 }, { x: 2, y: 1 } ],
      [ { x: 2, y: 1 }, { x: 2, y: 2 } ],
      [ { x: 3, y: 0 }, { x: 3, y: 1 } ],
      [ { x: 3, y: 1 }, { x: 3, y: 2 } ],
      [ { x: 4, y: 0 }, { x: 4, y: 1 } ],
      [ { x: 4, y: 1 }, { x: 4, y: 2 } ]
    ]);
    expect(JSON.stringify(moves)).toBe(answer);
  });

  it('handles x-only axis, adjacent-only on trapezoid 5x3 board', () => {
    const rules: GameRules = {
      adjacentRequired: true,
      minNumOfPegsCanTake: 1,
      maxNumOfPegsCanTake: 2,
      xOnly: true,
    };
    const moves = getAllPossibleMoves(
      rules,
      boardTrapezoid5x3,
      GameState.PLAYER_ONES_TURN,
    );
    // prettier-ignore
    const answer = JSON.stringify([
      [ { x: 0, y: 0 } ],
      [ { x: 1, y: 0 } ],
      [ { x: 2, y: 0 } ],
      [ { x: 3, y: 0 } ],
      [ { x: 4, y: 0 } ],
      [ { x: 0, y: 0 }, { x: 1, y: 0 } ],
      [ { x: 1, y: 0 }, { x: 2, y: 0 } ],
      [ { x: 2, y: 0 }, { x: 3, y: 0 } ],
      [ { x: 3, y: 0 }, { x: 4, y: 0 } ],
      [ { x: 1, y: 1 } ],
      [ { x: 2, y: 1 } ],
      [ { x: 3, y: 1 } ],
      [ { x: 4, y: 1 } ],
      [ { x: 1, y: 1 }, { x: 2, y: 1 } ],
      [ { x: 2, y: 1 }, { x: 3, y: 1 } ],
      [ { x: 3, y: 1 }, { x: 4, y: 1 } ],
      [ { x: 2, y: 2 } ],
      [ { x: 3, y: 2 } ],
      [ { x: 4, y: 2 } ],
      [ { x: 2, y: 2 }, { x: 3, y: 2 } ],
      [ { x: 3, y: 2 }, { x: 4, y: 2 } ],
    ]);
    expect(JSON.stringify(moves)).toBe(answer);
  });

  it('handles x-and-y axis, non-adjacent-only on trapezoid 5x3 board', () => {
    const rules: GameRules = {
      adjacentRequired: false,
      minNumOfPegsCanTake: 1,
      maxNumOfPegsCanTake: 2,
      xOnly: false,
    };
    const moves = getAllPossibleMoves(
      rules,
      boardTrapezoid5x3,
      GameState.PLAYER_ONES_TURN,
    );
    // prettier-ignore
    const answer = JSON.stringify([
      [ { x: 0, y: 0 } ],
      [ { x: 1, y: 0 } ],
      [ { x: 2, y: 0 } ],
      [ { x: 3, y: 0 } ],
      [ { x: 4, y: 0 } ],
      [ { x: 0, y: 0 }, { x: 1, y: 0 } ],
      [ { x: 0, y: 0 }, { x: 2, y: 0 } ],
      [ { x: 0, y: 0 }, { x: 3, y: 0 } ],
      [ { x: 0, y: 0 }, { x: 4, y: 0 } ],
      [ { x: 1, y: 0 }, { x: 2, y: 0 } ],
      [ { x: 1, y: 0 }, { x: 3, y: 0 } ],
      [ { x: 1, y: 0 }, { x: 4, y: 0 } ],
      [ { x: 2, y: 0 }, { x: 3, y: 0 } ],
      [ { x: 2, y: 0 }, { x: 4, y: 0 } ],
      [ { x: 3, y: 0 }, { x: 4, y: 0 } ],
      [ { x: 1, y: 1 } ],
      [ { x: 2, y: 1 } ],
      [ { x: 3, y: 1 } ],
      [ { x: 4, y: 1 } ],
      [ { x: 1, y: 1 }, { x: 2, y: 1 } ],
      [ { x: 1, y: 1 }, { x: 3, y: 1 } ],
      [ { x: 1, y: 1 }, { x: 4, y: 1 } ],
      [ { x: 2, y: 1 }, { x: 3, y: 1 } ],
      [ { x: 2, y: 1 }, { x: 4, y: 1 } ],
      [ { x: 3, y: 1 }, { x: 4, y: 1 } ],
      [ { x: 2, y: 2 } ],
      [ { x: 3, y: 2 } ],
      [ { x: 4, y: 2 } ],
      [ { x: 2, y: 2 }, { x: 3, y: 2 } ],
      [ { x: 2, y: 2 }, { x: 4, y: 2 } ],
      [ { x: 3, y: 2 }, { x: 4, y: 2 } ],
      [ { x: 1, y: 0 }, { x: 1, y: 1 } ],
      [ { x: 2, y: 0 }, { x: 2, y: 1 } ],
      [ { x: 2, y: 0 }, { x: 2, y: 2 } ],
      [ { x: 2, y: 1 }, { x: 2, y: 2 } ],
      [ { x: 3, y: 0 }, { x: 3, y: 1 } ],
      [ { x: 3, y: 0 }, { x: 3, y: 2 } ],
      [ { x: 3, y: 1 }, { x: 3, y: 2 } ],
      [ { x: 4, y: 0 }, { x: 4, y: 1 } ],
      [ { x: 4, y: 0 }, { x: 4, y: 2 } ],
      [ { x: 4, y: 1 }, { x: 4, y: 2 } ]
    ]);
    expect(JSON.stringify(moves)).toBe(answer);
  });

  it(`handles a finished game`, () => {
    const rules: GameRules = {
      adjacentRequired: false,
      minNumOfPegsCanTake: 1,
      maxNumOfPegsCanTake: 2,
      xOnly: false,
    };
    const board: GameTileState[][] = [
      [2, 2, 2],
      [2, 2, 2],
      [2, 2, 2],
    ];
    const p1 = getAllPossibleMoves(rules, board, GameState.PLAYER_ONE_WINS);
    const p2 = getAllPossibleMoves(rules, board, GameState.PLAYER_TWO_WINS);
    // Invalid states, but might as well check
    const p1Turn = getAllPossibleMoves(
      rules,
      board,
      GameState.PLAYER_ONES_TURN,
    );
    const p2Turn = getAllPossibleMoves(
      rules,
      board,
      GameState.PLAYER_TWOS_TURN,
    );
    expect(p1).toHaveLength(0);
    expect(p2).toHaveLength(0);
    expect(p1Turn).toHaveLength(0);
    expect(p2Turn).toHaveLength(0);
  });
});
