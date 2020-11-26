import { Game, GameState, Move } from '@quinnturner/peg-game-engine';

import { getAllPossibleMoves } from './mechanics';
import { getPlayersObjective } from './objective';

type Evaluation =
  | GameState.PLAYER_ONE_WINS
  | GameState.PLAYER_TWO_WINS
  | undefined;

interface MoveTreeNode {
  value: Move[] | undefined;
  children: Array<MoveTreeNode> | undefined;
  evaluation: Evaluation;
}

interface BfsState {
  tree: MoveTreeNode;
  playersTurn: GameState.PLAYER_ONES_TURN | GameState.PLAYER_TWOS_TURN;
}

function dfsHelper(
  game: Game,
  objective: GameState.PLAYER_ONE_WINS | GameState.PLAYER_TWO_WINS,
  bfsState: BfsState,
  currentNode: MoveTreeNode,
): Move[] {
  // I think this is always true?
  if (currentNode.children === undefined) {
    const childMoves = getAllPossibleMoves(game.rules, game.board, game.state);
    if (childMoves.length === 0) {
      // End of game!
      const state = game.state;
      if (
        state === GameState.PLAYER_ONES_TURN ||
        state === GameState.PLAYER_TWOS_TURN
      ) {
        throw new Error(`Invalid state, the game should be over!`);
      }
      currentNode.evaluation = state;
      return [];
    } else {
      currentNode.children = childMoves.map((m) => ({
        // gets defined recursively
        evaluation: undefined,
        value: m,
        // gets defined recursively
        children: undefined,
      }));
      for (let c = 0; c < childMoves.length; c++) {
        const childMove = childMoves[c];
        game.move(childMove);
        const childNode = currentNode.children[c];
        dfsHelper(game, objective, bfsState, childNode);
        const playersObjective = getPlayersObjective(
          game.state as GameState.PLAYER_ONES_TURN | GameState.PLAYER_TWOS_TURN,
        );
        if (childNode.children && childNode.children.length > 0) {
          if (
            // game.state === bfsState.playersTurn &&
            childNode.children.some((c) => c.evaluation === playersObjective)
          ) {
            childNode.evaluation = playersObjective;
          } else if (
            childNode.children.every(
              (x) => x.evaluation === childNode.children![0].evaluation,
            )
          ) {
            childNode.evaluation = childNode.children![0].evaluation;
          } else {
            // This happens when we break out early.
            // console.log(bfsState);
            console.log(childNode.evaluation);
            // nextNode.evaluation = objective;
          }
        }
        game.undo();
        if (childNode.evaluation !== playersObjective) {
          // exit early, we have found our objective!
          break;
        }
      }
    }
  } else {
    console.log('nah');
  }
  return [];
}

export default function dfs(game: Game): Move[] {
  const { state } = game;
  if (
    state === GameState.PLAYER_ONE_WINS ||
    state === GameState.PLAYER_TWO_WINS
  ) {
    return [];
  }
  const recentMove = game.peekMove();
  // const moves = getAllPossibleMoves(rules, board, state);
  const bfsState: BfsState = {
    tree: {
      value: recentMove,
      evaluation: undefined,
      // children: moves.map((m) => ({
      //   // gets defined recursively
      //   evaluation: undefined,
      //   value: m,
      //   // gets defined recursively
      //   children: undefined,
      // })),
      children: undefined,
    },
    playersTurn: state,
  };
  const currentNode = bfsState.tree;
  const objective =
    state === GameState.PLAYER_ONES_TURN
      ? GameState.PLAYER_ONE_WINS
      : GameState.PLAYER_TWO_WINS;
  const result = dfsHelper(game, objective, bfsState, currentNode);

  return result;
}
