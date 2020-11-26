import { GameState } from '@quinnturner/peg-game-engine';

export function getPlayersObjective(
  gameState: GameState.PLAYER_ONES_TURN | GameState.PLAYER_TWOS_TURN,
) {
  if (gameState === GameState.PLAYER_ONES_TURN) {
    return GameState.PLAYER_ONE_WINS;
  }
  return GameState.PLAYER_TWO_WINS;
}
