import { GameState, Move } from '@quinnturner/peg-game-engine';

export default interface MoveTreeNode {
  value?: Move[];
  children?: Array<MoveTreeNode>;
  evaluation?: GameState.PLAYER_ONE_WINS | GameState.PLAYER_TWO_WINS;
}
