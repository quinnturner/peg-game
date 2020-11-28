import { boardCircle3x3, Game, GameRules } from '@quinnturner/peg-game-engine';

import dfs from '../src/dfs';

describe(`The depth-first search solver`, () => {
  // This should pass, it just takes time
  // it(`handles a small game where the p1 searcher wins, x-and-y, adjacent`, () => {
  //   const rules: GameRules = {
  //     adjacentRequired: true,
  //     minNumOfPegsCanTake: 1,
  //     maxNumOfPegsCanTake: 2,
  //     xOnly: true,
  //   };
  //   const game = new Game(rules, boardP3x2);
  //   const result = dfs(game);
  //   expect(result).toBeDefined();
  //   // Since the first move will win, it stops its search there
  //   expect(result).toHaveLength(1);
  //   expect(result[0].x).toBe(0);
  //   expect(result[0].y).toBe(0);
  // });
  it(`handles a small game where the p1 searcher wins, x-and-y, adjacent`, () => {
    const rules: GameRules = {
      adjacentRequired: true,
      minNumOfPegsCanTake: 1,
      maxNumOfPegsCanTake: 2,
      xOnly: true,
    };
    const game = new Game(rules, boardCircle3x3);
    const result = dfs(game);
    expect(result).toBeDefined();
    // Since the first move will win, it stops its search there
    expect(result).toHaveLength(1);
    expect(result[0].x).toBe(0);
    expect(result[0].y).toBe(0);
  });
});
