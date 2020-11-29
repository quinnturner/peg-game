import { GameTileState } from '@quinnturner/peg-game-engine';

export enum SelectedGameTileState {
  SELECTED = 4,
}

export type SelectableGameTileState = SelectedGameTileState | GameTileState;
