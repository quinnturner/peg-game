import { Game, GameState, Move } from '@quinnturner/peg-game-engine';

import { getAllPossibleMoves } from './mechanics';
import { getOtherPlayersObjective, getPlayersObjective } from './objective';

type Evaluation =
  | GameState.PLAYER_ONE_WINS
  | GameState.PLAYER_TWO_WINS
  | undefined;

interface MoveTreeNode {
  value: Move[] | undefined;
  children: Array<MoveTreeNode> | undefined;
  evaluation: Evaluation;
}

function dfsHelper(
  game: Game,
  objective: GameState.PLAYER_ONE_WINS | GameState.PLAYER_TWO_WINS,
  currentNode: MoveTreeNode,
): void {
  if (currentNode.children === undefined) {
    const childMoves = getAllPossibleMoves(game.rules, game.board, game.state);
    if (childMoves.length === 0) {
      // End of game!
      const { state } = game;
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
        dfsHelper(game, objective, childNode);
        const playersObjective = getPlayersObjective(
          game.state as GameState.PLAYER_ONES_TURN | GameState.PLAYER_TWOS_TURN,
        );
        const cc = childNode.children;
        if (childNode.evaluation === undefined && cc?.length) {
          if (cc.some((c) => c.evaluation === playersObjective)) {
            childNode.evaluation = playersObjective;
          } else if (cc.every((x) => x.evaluation === cc![0].evaluation)) {
            childNode.evaluation = cc![0].evaluation;
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
  const currentNode: MoveTreeNode = {
    value: recentMove,
    evaluation: undefined,
    children: undefined,
  };
  const objective = getPlayersObjective(state);
  // This will populate currentNode with evaluations and possible moves
  dfsHelper(game, objective, currentNode);

  const { children } = currentNode;

  if (!children) {
    // This shouldn't be possible since there should be at least one legal move
    throw new Error('No children in DFS');
  }

  // If there's a winning node, take it (if not, it's undefined)
  const winningNode = children.find((c) => c.evaluation === objective);
  if (winningNode) {
    // Weeeeeeee are the champions, my friends
    currentNode.evaluation = objective;
    if (!winningNode.value) {
      // Don't think this can happen.
      throw new Error('Winning node found but has no value for DFS evaluation');
    }
    return winningNode.value;
  }

  // Weeeeee'll keep on fighting 'til the end
  const notObjective = getOtherPlayersObjective(objective);
  currentNode.evaluation = notObjective;

  // Find the non-winning move that maximized chance of a mistake by the other player
  // without performing further traversals.
  let incumbentWinPercentage = -1;
  let incumbentWinIndex = -1;
  for (let childIndex = 0; childIndex < children.length; childIndex++) {
    const currentChild = children[childIndex];
    // Note, this is only an estimate.
    // Many of the evaluations will be undefined since the DFS will halt
    // when it finds a winning move for the opponent.
    const winningCount = currentChild.children!.reduce(
      (total, c) => (c.evaluation === objective ? total + 1 : total),
      0,
    );
    const winningPercentage = winningCount / currentChild.children!.length;
    if (winningPercentage > incumbentWinPercentage) {
      incumbentWinPercentage = winningPercentage;
      incumbentWinIndex = childIndex;
    }
  }
  const incumbentNode = children[incumbentWinIndex];
  const incumbentMove = incumbentNode.value!;
  return incumbentMove;
}
