import GameHistory from './game-history';
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from './game-rules';
import GameState from './game-state';
import GameTileState from './game-tile-state';
import Move, { hashPartialMove } from './move';

import type GameRules from './game-rules';

export default class Game {
  readonly #rules: GameRules;
  readonly #board: GameTileState[][];
  #isFirstPlayersTurn: boolean;
  #numPegsLeft: number;
  #history: GameHistory;

  constructor(
    rules: Readonly<GameRules>,
    initialBoard: readonly GameTileState[][],
    isFirstPlayersTurn = true,
  ) {
    this.#rules = { ...rules };
    Game.validateRules(this.#rules);

    if (initialBoard[0].length > MAX_X) {
      throw new Error("The board's x-axis is too large");
    }
    if (initialBoard[0].length < MIN_X) {
      throw new Error("The board's x-axis is too small");
    }
    if (initialBoard.length > MAX_Y) {
      throw new Error("The board's y-axis is too large");
    }
    if (initialBoard.length < MIN_Y) {
      throw new Error("The board's y-axis is too small");
    }

    // Perform a defensive copy of the board to avoid accidental manipulation.
    const len = initialBoard.length;
    const copy = new Array<GameTileState[]>(len);
    for (let i = 0; i < len; ++i) copy[i] = initialBoard[i].slice(0);

    this.#board = copy;
    this.#isFirstPlayersTurn = isFirstPlayersTurn;

    // Calculate the number of pegs left based on the board
    let numPegsLeft = 0;
    copy.forEach((row) =>
      row.forEach((tile) => {
        if (tile === GameTileState.OCCUPIED) numPegsLeft++;
      }),
    );
    this.#numPegsLeft = numPegsLeft;
    this.#history = new GameHistory();
  }

  /**
   * Get the rules.
   * A defensive copy is performed to prevent manipulation.
   */
  get rules(): Readonly<GameRules> {
    return this.#rules;
  }

  get board(): readonly (readonly GameTileState[])[] {
    return this.#board;
  }

  get state(): GameState {
    if (this.#numPegsLeft !== 0) {
      if (this.#isFirstPlayersTurn) {
        return GameState.PLAYER_ONES_TURN;
      }
      return GameState.PLAYER_TWOS_TURN;
    }
    // If the next move is for player one (after there's no pegs left),
    // that means that player two played the last move.
    // If player two plays the last move, player one wins.
    if (this.#isFirstPlayersTurn) {
      return GameState.PLAYER_ONE_WINS;
    }
    return GameState.PLAYER_TWO_WINS;
  }

  get lengthOfX(): number {
    return this.#board[0].length;
  }

  get lengthOfY(): number {
    return this.#board.length;
  }

  get pegCount(): number {
    return this.#numPegsLeft;
  }

  static validateRules(rules: Readonly<GameRules>): void {
    if (
      !Number.isInteger(rules.maxNumOfPegsCanTake) ||
      rules.maxNumOfPegsCanTake < 1
    ) {
      throw new Error(
        `The maximum number of pegs that a player can take must be greater than or equal to 1.`,
      );
    }
    if (
      !Number.isInteger(rules.minNumOfPegsCanTake) ||
      rules.minNumOfPegsCanTake < 1
    ) {
      throw new Error(
        `The minimum number of pegs that a player can take must be greater than or equal to 1.`,
      );
    }
    if (rules.maxNumOfPegsCanTake <= rules.minNumOfPegsCanTake) {
      throw new Error(
        `The maximum number of pegs must be greater than the minimum number of pegs that a player can take.`,
      );
    }
  }

  getTile(x: number, y: number): GameTileState {
    return this.#board[y][x];
  }

  validateMoves(moves: readonly Move[]): void {
    const {
      adjacentRequired,
      maxNumOfPegsCanTake,
      minNumOfPegsCanTake,
      xOnly,
    } = this.#rules;
    if (moves.length < minNumOfPegsCanTake) {
      throw new Error(
        `Illegal move: move count must be at least ${minNumOfPegsCanTake}`,
      );
    }
    // Account for how many pegs are left.
    // While this would have automatically been caught later,
    // this error message makes a bit more sense and is convenient.
    if (moves.length > Math.min(this.#numPegsLeft, maxNumOfPegsCanTake)) {
      throw new Error(
        `Illegal move: move count must be at most ${maxNumOfPegsCanTake}`,
      );
    }

    // FIXME: Integrate the duplicate move check more naturally into the rest of the error handling.
    if (
      new Set(moves.map((move) => hashPartialMove(move))).size < moves.length
    ) {
      throw new Error('Duplicate moves provided');
    }

    // Check if the moves are valid
    moves.forEach(({ x, y }) => {
      if (!Number.isInteger(x) || x < 0 || x >= this.#board[0].length) {
        throw new Error(`x out of bounds: { x: ${x}, y: ${y} }`);
      }
      if (!Number.isInteger(y) || y < 0 || y >= this.#board.length) {
        throw new Error(`y out of bounds: { x: ${x}, y: ${y} }`);
      }
      const tile = this.#board[y][x];
      switch (tile) {
        case GameTileState.OCCUPIED:
          // valid
          break;
        case GameTileState.NON_EXISTENT:
          throw new Error(
            `The game tile must be occupied to remove it: { x: ${x}, y: ${y} }. It is currently non existent.`,
          );
        case GameTileState.VACANT:
          throw new Error(
            `The game tile must be occupied to remove it: { x: ${x}, y: ${y} }. It is currently vacant.`,
          );
      }
    });

    const sortedYs = moves.map(({ y }) => y).sort((a, b) => a - b);
    const ySet = new Set(sortedYs);
    if (xOnly) {
      // yValues.size represents the number of unique y values in the moves.
      if (ySet.size > 1) {
        throw new Error(`Cannot take pegs from multiple rows.`);
      }
    }

    if (adjacentRequired && moves.length > 1) {
      // Must be either all horizontal or vertical.
      // The move order within the moves array does not have to be sequential.
      // This property makes it slightly harder to determine the adjacency.

      const sortedXs = moves.map(({ x }) => x).sort((a, b) => a - b);

      const verifyArrayIncrements = (arr: number[]): void => {
        // If it's xOnly, it's easier to determine adjacency.
        for (let i = 0; i < arr.length - 1; i++) {
          // Must be ascending with a difference of one for all values
          if (arr[i] + 1 !== arr[i + 1]) {
            // FIXME: Better error message for adjacency violations
            throw new Error(`Violates adjacency: ${arr[i]}, ${arr[i + 1]}`);
          }
        }
      };

      if (ySet.size === 1) {
        verifyArrayIncrements(sortedXs);
      } else if (ySet.size === moves.length) {
        const xSet = new Set(sortedXs);
        if (xSet.size > 1) {
          // Invalid, at least one duplicate x value
          // FIXME: Better error message for adjacency violations
          throw new Error(`Violates adjacency: duplicate x-value`);
        }
        verifyArrayIncrements(sortedYs);
      } else {
        // Invalid, at least one duplicate y value
        // FIXME: Better error message for adjacency violations
        throw new Error(`Violates adjacency: duplicate y-value`);
      }
    }
  }

  peekMove(): Move[] | undefined {
    const val = this.#history.peek();
    if (!val) return val;
    const moves = this.cloneMoves(val);
    return moves;
  }

  private cloneMoves(moves: readonly Readonly<Move>[]): Move[] {
    return [...moves.map(({ x, y }) => ({ x, y }))];
  }

  move(moves: readonly Readonly<Move>[]): void {
    // Defensive copy (deep clone) of the moves to prevent modification after passing.
    // This is particularly important to protect the integrity of the move history.
    // For an example of what that means, you can view the test:
    // `cannot change the history after a move has been played`
    const movesCopy = this.cloneMoves(moves);

    this.validateMoves(movesCopy);
    // The moves are valid.

    movesCopy.forEach(({ x, y }) => {
      this.#board[y][x] = GameTileState.VACANT;
    });

    // Add the move to the history
    this.#history.push(movesCopy);

    // Remove the pegs
    this.#numPegsLeft -= moves.length;

    // Change the player move
    this.#isFirstPlayersTurn = !this.#isFirstPlayersTurn;
  }

  undo(): Move[] | undefined {
    // Remove the move to the history
    const moves = this.#history.pop();
    // Start of the game, nothing changes
    if (!moves) return moves;

    moves.forEach(({ x, y }) => {
      this.#board[y][x] = GameTileState.OCCUPIED;
    });

    // Add the peg counts back
    this.#numPegsLeft += moves.length;

    // Change the player move
    this.#isFirstPlayersTurn = !this.#isFirstPlayersTurn;
    return moves;
  }

  toJSON(): string {
    const obj = {
      rules: this.#rules,
      board: this.#board,
      isFirstPlayersTurn: this.#isFirstPlayersTurn,
    };
    const val = JSON.stringify(obj);
    return val;
  }

  print(): void {
    console.table(this.#board);
  }
}
