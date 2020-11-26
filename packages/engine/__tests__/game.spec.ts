import Game from '../src/game';
import { MAX_X, MAX_Y } from '../src/game-rules';
import GameState from '../src/game-state';
import GameTileState from '../src/game-tile-state';

import type GameRules from '../src/game-rules';
import { boardTrapezoid5x3 } from '../src/game-boards';
import Move from '../src/move';

describe(`A non-adjacent game`, () => {
  it(`can create and play a game with x-only and non-adjacent rules`, () => {
    const nonAdjacentRules: GameRules = {
      adjacentRequired: false,
      maxNumOfPegsCanTake: 2,
      minNumOfPegsCanTake: 1,
      xOnly: true,
    };

    const game = new Game(nonAdjacentRules, boardTrapezoid5x3);

    // First, check base case, simple single moves

    expect(game.lengthOfX).toBe(boardTrapezoid5x3[0].length);
    expect(game.lengthOfY).toBe(boardTrapezoid5x3.length);
    expect(game.pegCount).toBe(12);
    // Ensure the board is good
    const gameBoard = game.board;
    expect(gameBoard).toHaveLength(boardTrapezoid5x3.length);
    expect(gameBoard[0]).toHaveLength(boardTrapezoid5x3[0].length);
    for (let y = 0; y < boardTrapezoid5x3.length; y++) {
      for (let x = 0; x < boardTrapezoid5x3[0].length; x++) {
        expect(gameBoard[y][x]).toBe(boardTrapezoid5x3[y][x]);
      }
    }

    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    game.move([{ x: 0, y: 0 }]);
    expect(game.state).toBe(GameState.PLAYER_TWOS_TURN);
    expect(game.getTile(0, 0)).toBe(GameTileState.VACANT);
    game.move([{ x: 1, y: 0 }]);
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(game.getTile(1, 0)).toBe(GameTileState.VACANT);

    // Next, try two legal double moves

    game.move([
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ]);
    expect(game.state).toBe(GameState.PLAYER_TWOS_TURN);
    expect(game.getTile(2, 0)).toBe(GameTileState.VACANT);
    expect(game.getTile(3, 0)).toBe(GameTileState.VACANT);
    game.move([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ]);
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(game.getTile(1, 1)).toBe(GameTileState.VACANT);
    expect(game.getTile(2, 1)).toBe(GameTileState.VACANT);

    // Nice! Okay, here's the current board with player one to move:
    //
    // gameTiles1 = [
    //    [2, 2, 2, 2, 1],
    //    [3, 2, 2, 1, 1],
    //    [3, 3, 1, 1, 1],
    //  ];
    //
    // In reality, this game is a win for player one.
    // I will let you try and figure out the details :).

    // We will continue with trying to make a bunch of illegal moves.
    // Hopefully, the game will catch all the illegal moves and not change the game state.

    // Try and remove a piece that is already removed
    expect(() => game.move([{ x: 0, y: 0 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Great, now, try and remove two pieces, only one of which has already been removed.
    expect(() =>
      game.move([
        { x: 1, y: 1 },
        { x: 3, y: 1 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Next, try and make some moves that are off the board
    expect(() => game.move([{ x: -1, y: 0 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(() => game.move([{ x: 0, y: -1 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(() => game.move([{ x: 0, y: 4 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(() => game.move([{ x: 5, y: 0 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Follow up with an empty move
    expect(() => game.move([])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Next, more moves than allowed
    expect(() =>
      game.move([
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Fail on diagonally-adjacent
    expect(() =>
      game.move([
        { x: 4, y: 0 },
        { x: 3, y: 1 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Fail a double move with a non-existing tile
    expect(() =>
      game.move([
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Fail on duplicate move
    expect(() =>
      game.move([
        { x: 4, y: 0 },
        { x: 4, y: 0 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Finally, fail to perform a double move that is not x-only
    expect(() =>
      game.move([
        { x: 4, y: 0 },
        { x: 4, y: 1 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Woo-hoo, we can continue with the game!
    // Refresher:
    //
    // gameTiles1 = [
    //    [2, 2, 2, 2, 1],
    //    [3, 2, 2, 1, 1],
    //    [3, 3, 1, 1, 1],
    //  ];

    // Let's finish strong with the winning moves for player 1.
    game.move([
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ]);
    expect(game.state).toBe(GameState.PLAYER_TWOS_TURN);

    game.move([{ x: 4, y: 0 }]);
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    game.move([
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ]);
    expect(game.state).toBe(GameState.PLAYER_TWOS_TURN);

    game.move([{ x: 2, y: 2 }]);
    expect(game.state).toBe(GameState.PLAYER_ONE_WINS);

    expect(game.pegCount).toBe(0);
  });
});

describe(`An adjacent game`, () => {
  it(`can create and play a game that's not x-only and requires adjacent peg picks`, () => {
    const adjacentRules: GameRules = {
      adjacentRequired: true,
      maxNumOfPegsCanTake: 2,
      minNumOfPegsCanTake: 1,
      xOnly: false,
    };

    const game = new Game(adjacentRules, boardTrapezoid5x3, true);

    // First, check base case, simple single moves

    expect(game.lengthOfX).toBe(boardTrapezoid5x3[0].length);
    expect(game.lengthOfY).toBe(boardTrapezoid5x3.length);
    expect(game.pegCount).toBe(12);

    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    game.move([{ x: 0, y: 0 }]);
    expect(game.state).toBe(GameState.PLAYER_TWOS_TURN);
    expect(game.getTile(0, 0)).toBe(GameTileState.VACANT);
    game.move([{ x: 1, y: 0 }]);
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(game.getTile(1, 0)).toBe(GameTileState.VACANT);

    // Next, try two legal adjacent double moves

    game.move([
      // As another attempt to throw it off, the moves can be in any order
      { x: 3, y: 0 },
      { x: 2, y: 0 },
    ]);
    expect(game.state).toBe(GameState.PLAYER_TWOS_TURN);
    expect(game.getTile(2, 0)).toBe(GameTileState.VACANT);
    expect(game.getTile(3, 0)).toBe(GameTileState.VACANT);
    game.move([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ]);
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(game.getTile(1, 1)).toBe(GameTileState.VACANT);
    expect(game.getTile(2, 1)).toBe(GameTileState.VACANT);

    // Nice! This probably looks familiar:
    //
    // gameTiles1 = [
    //    [2, 2, 2, 2, 1],
    //    [3, 2, 2, 1, 1],
    //    [3, 3, 1, 1, 1],
    //  ];

    // Try and remove a piece that is already removed
    expect(() => game.move([{ x: 0, y: 0 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Great, now, try and remove two pieces, only one of which has already been removed.
    expect(() =>
      game.move([
        { x: 1, y: 1 },
        { x: 3, y: 1 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Next, try and make some moves that are off the board
    expect(() => game.move([{ x: -1, y: 0 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(() => game.move([{ x: 0, y: -1 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(() => game.move([{ x: 0, y: 4 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
    expect(() => game.move([{ x: 5, y: 0 }])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Follow up with an empty move
    expect(() => game.move([])).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Next, more moves than allowed
    expect(() =>
      game.move([
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Now, for the tricker moves. Recall:
    //
    // gameTiles1 = [
    //    [2, 2, 2, 2, 1],
    //    [3, 2, 2, 1, 1],
    //    [3, 3, 1, 1, 1],
    //  ];

    // Fail on a non-adjacent and row-based double pick (for an adjacent-only game)
    expect(() =>
      game.move([
        { x: 2, y: 2 },
        { x: 4, y: 2 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Fail on a non-adjacent and column-based double pick (for an adjacent-only game)
    expect(() =>
      game.move([
        { x: 4, y: 0 },
        { x: 4, y: 2 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Fail on diagonally-adjacent (for an adjacent-only game)
    expect(() =>
      game.move([
        { x: 4, y: 0 },
        { x: 3, y: 1 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Fail a double move with a non-existing tile
    expect(() =>
      game.move([
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Fail on duplicate move
    expect(() =>
      game.move([
        { x: 4, y: 0 },
        { x: 4, y: 0 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Alright, that's pretty much all of the tests that I can formulate.
    // Let's continue with legal moves.

    game.move([
      { x: 4, y: 0 },
      { x: 4, y: 1 },
    ]);
    expect(game.state).toBe(GameState.PLAYER_TWOS_TURN);

    // gameTiles1 = [
    //    [2, 2, 2, 2, 2],
    //    [3, 2, 2, 1, 2],
    //    [3, 3, 1, 1, 1],
    //  ];

    game.move([{ x: 3, y: 1 }]);
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    // Bad move, but want to force p2 to win for test coverage
    game.move([{ x: 3, y: 2 }]);
    expect(game.state).toBe(GameState.PLAYER_TWOS_TURN);

    game.move([{ x: 2, y: 2 }]);
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);

    game.move([{ x: 4, y: 2 }]);
    expect(game.state).toBe(GameState.PLAYER_TWO_WINS);

    expect(game.pegCount).toBe(0);
  });
});

describe(`An adjourned game`, () => {
  it(`supports having the second player start the position`, () => {
    const adjacentRules: GameRules = {
      adjacentRequired: false,
      maxNumOfPegsCanTake: 2,
      minNumOfPegsCanTake: 1,
      xOnly: false,
    };
    const game = new Game(adjacentRules, boardTrapezoid5x3, false);
    expect(game.state).toBe(GameState.PLAYER_TWOS_TURN);
  });
});

describe(`Large games`, () => {
  it(`fails to create a game with too small of an x-axis`, () => {
    const adjacentRules: GameRules = {
      adjacentRequired: false,
      maxNumOfPegsCanTake: 2,
      minNumOfPegsCanTake: 1,
      xOnly: false,
    };
    expect(
      () =>
        new Game(adjacentRules, [
          [GameTileState.OCCUPIED],
          [GameTileState.OCCUPIED],
        ]),
    ).toThrow();
  });
  it(`fails to create a game with too small of an y-axis`, () => {
    const adjacentRules: GameRules = {
      adjacentRequired: false,
      maxNumOfPegsCanTake: 2,
      minNumOfPegsCanTake: 1,
      xOnly: false,
    };
    expect(
      () =>
        new Game(adjacentRules, [
          new Array(MAX_X).fill(GameTileState.OCCUPIED),
        ]),
    ).toThrow();
  });
  it(`fails to create a game with too large of a x-axis`, () => {
    const adjacentRules: GameRules = {
      adjacentRequired: false,
      maxNumOfPegsCanTake: 2,
      minNumOfPegsCanTake: 1,
      xOnly: false,
    };
    expect(
      () =>
        new Game(
          adjacentRules,
          new Array(2).fill(new Array(MAX_X + 1).fill(GameTileState.OCCUPIED)),
        ),
    ).toThrow();
  });
  it(`fails to create a game with too large of a y-axis`, () => {
    const adjacentRules: GameRules = {
      adjacentRequired: false,
      maxNumOfPegsCanTake: 2,
      minNumOfPegsCanTake: 1,
      xOnly: false,
    };
    expect(
      () =>
        new Game(
          adjacentRules,
          new Array(MAX_Y + 1).fill([
            GameTileState.OCCUPIED,
            GameTileState.OCCUPIED,
          ]),
        ),
    ).toThrow();
  });
  it(`fails on multiple y's on larger adjacent move counts`, () => {
    const adjacentRules: GameRules = {
      adjacentRequired: true,
      maxNumOfPegsCanTake: 3,
      minNumOfPegsCanTake: 1,
      xOnly: false,
    };
    // 5x5 with all occupied pegs
    const game = new Game(
      adjacentRules,
      new Array(5).fill(new Array(5).fill(GameTileState.OCCUPIED)),
    );
    expect(() =>
      game.move([
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]),
    ).toThrow();
    expect(game.state).toBe(GameState.PLAYER_ONES_TURN);
  });
});

describe(`Engine robustness`, () => {
  it(`cannot change the rules after the game is created`, () => {
    const rules: GameRules = {
      adjacentRequired: false,
      maxNumOfPegsCanTake: 2,
      minNumOfPegsCanTake: 1,
      xOnly: false,
    };
    const game = new Game(rules, boardTrapezoid5x3);
    // First attempt at changing the rules, just change the initial object's values
    rules.adjacentRequired = true;
    // Can't change this property since it's readonly!
    // game.rules.maxNumOfPegsCanTake = 3;

    const actualRules = game.rules;
    expect(actualRules.maxNumOfPegsCanTake).toBe(2);
    expect(actualRules.adjacentRequired).toBe(false);
  });
  it(`cannot change the history after a move has been played`, () => {
    const rules: GameRules = {
      adjacentRequired: false,
      maxNumOfPegsCanTake: 2,
      minNumOfPegsCanTake: 1,
      xOnly: false,
    };
    const game = new Game(rules, boardTrapezoid5x3);
    const move: Move[] = [{ x: 1, y: 1 }];
    game.move(move);
    move[0].x = 2;
    move.push({ x: 3, y: 3 });
    expect(game.getTile(1, 1)).toBe(GameTileState.VACANT);
    expect(game.getTile(2, 1)).toBe(GameTileState.OCCUPIED);
    const undoneMove = game.undo();
    expect(undoneMove).toBeDefined();
    if (!undoneMove) return;
    // These lines are what matters.
    // We gotta make sure that modifying the move via move[0].x = 2
    // doesn't change the history of the game.
    // Otherwise, we lose the game's integrity.
    expect(undoneMove).toHaveLength(1);
    expect(undoneMove[0].x).toBe(1);
    expect(undoneMove[0].y).toBe(1);
  });
});

describe('Serialization', () => {
  const adjacentRules: GameRules = {
    adjacentRequired: true,
    maxNumOfPegsCanTake: 3,
    minNumOfPegsCanTake: 1,
    xOnly: false,
  };
  // 5x5 with all occupied pegs
  const game = new Game(
    adjacentRules,
    new Array(3).fill(new Array(3).fill(GameTileState.OCCUPIED)),
  );
  game.move([{ x: 0, y: 0 }]);

  it(`correctly toJSONs`, () => {
    const jsonStr = game.toJSON();
    expect(jsonStr).toEqual(
      `{"rules":{"adjacentRequired":true,"maxNumOfPegsCanTake":3,"minNumOfPegsCanTake":1,"xOnly":false},"board":[[2,1,1],[1,1,1],[1,1,1]],"isFirstPlayersTurn":false}`,
    );
  });

  it(`correctly prints in tabular format`, () => {
    const spy = jest
      .spyOn(global.console, 'table')
      .mockImplementation(() => {});
    game.print();
    expect(global.console.table).toBeCalled();
    spy.mockRestore();
  });
});
