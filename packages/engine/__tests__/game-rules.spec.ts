import Game from '../src/game';
import GameRules from '../src/game-rules';

const defaultRules: GameRules = {
  adjacentRequired: false,
  maxNumOfPegsCanTake: 0,
  minNumOfPegsCanTake: 1,
  xOnly: true,
};

describe(`Game rules`, () => {
  it(`can validate valid games`, () => {
    expect(() =>
      Game.validateRules({
        ...defaultRules,
        maxNumOfPegsCanTake: 2,
        minNumOfPegsCanTake: 1,
      }),
    ).not.toThrow();
    expect(() =>
      Game.validateRules({
        ...defaultRules,
        maxNumOfPegsCanTake: 5,
        minNumOfPegsCanTake: 2,
      }),
    ).not.toThrow();
    expect(() =>
      Game.validateRules({
        ...defaultRules,
        maxNumOfPegsCanTake: 2,
        minNumOfPegsCanTake: 1,
      }),
    ).not.toThrow();
  });

  it(`can throw on invalid games`, () => {
    expect(() =>
      Game.validateRules({
        ...defaultRules,
        maxNumOfPegsCanTake: 2,
        minNumOfPegsCanTake: 0,
      }),
    ).toThrow();
    expect(() =>
      Game.validateRules({
        ...defaultRules,
        maxNumOfPegsCanTake: 1,
        minNumOfPegsCanTake: 1,
      }),
    ).toThrow();
    expect(() =>
      Game.validateRules({
        ...defaultRules,
        maxNumOfPegsCanTake: 0,
        minNumOfPegsCanTake: 1,
      }),
    ).toThrow();
    expect(() =>
      Game.validateRules({
        ...defaultRules,
        maxNumOfPegsCanTake: 2,
        minNumOfPegsCanTake: 2,
      }),
    ).toThrow();
    expect(() =>
      Game.validateRules({
        ...defaultRules,
        maxNumOfPegsCanTake: 2,
        minNumOfPegsCanTake: 3,
      }),
    ).toThrow();
  });
});
