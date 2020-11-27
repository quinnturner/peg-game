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
): void {
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
      return;
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
        const otherPlayersObjective = getPlayersObjective(
          game.state as GameState.PLAYER_ONES_TURN | GameState.PLAYER_TWOS_TURN,
        );
        game.move(childMove);
        const childNode = currentNode.children[c];
        dfsHelper(game, objective, bfsState, childNode);
        const playersObjective = getPlayersObjective(
          game.state as GameState.PLAYER_ONES_TURN | GameState.PLAYER_TWOS_TURN,
        );
        if (childNode.evaluation === undefined) {
          if (childNode.children && childNode.children.length > 0) {
            if (
              childNode.children.some((c) => c.evaluation === playersObjective)
            ) {
              childNode.evaluation = playersObjective;
            } else if (
              childNode.children.every(
                (x) => x.evaluation === childNode.children![0].evaluation,
              )
            ) {
              childNode.evaluation = childNode.children![0].evaluation;
            }
          }
        }
        game.undo();
        if (childNode.evaluation === otherPlayersObjective) {
          currentNode.evaluation = otherPlayersObjective;
          break;
        }
      }
    }
  }
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
  const bfsState: BfsState = {
    tree: {
      value: recentMove,
      evaluation: undefined,
      children: undefined,
    },
    playersTurn: state,
  };
  const currentNode = bfsState.tree;
  const objective =
    state === GameState.PLAYER_ONES_TURN
      ? GameState.PLAYER_ONE_WINS
      : GameState.PLAYER_TWO_WINS;
  const notObjective =
    objective === GameState.PLAYER_ONE_WINS
      ? GameState.PLAYER_TWO_WINS
      : GameState.PLAYER_ONE_WINS;
  dfsHelper(game, objective, bfsState, currentNode);
  bfsState.tree.evaluation = bfsState.tree.children?.some(
    (c) => c.evaluation === objective,
  )
    ? objective
    : notObjective;
  if (bfsState.tree.evaluation === objective) {
    return bfsState.tree.children?.find((c) => c.evaluation === objective)
      ?.value!;
  }
  const randomVal = Math.floor(Math.random() * bfsState.tree.children!.length);
  const randomMove = bfsState.tree.children![randomVal].value!;
  return randomMove;
}
