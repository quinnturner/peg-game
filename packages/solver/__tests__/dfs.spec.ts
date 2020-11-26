import {
  boardTrapezoid5x3,
  Game,
  GameRules,
} from '@quinnturner/peg-game-engine';

import dfs from '../src/dfs';

describe(`The depth-first search solver`, () => {
  it(`somehow works`, () => {
    const rules: GameRules = {
      adjacentRequired: true,
      minNumOfPegsCanTake: 1,
      maxNumOfPegsCanTake: 2,
      xOnly: false,
    };
    const game = new Game(rules, boardTrapezoid5x3);
    const result = dfs(game);
    expect(result).toBeDefined();
  });
});
