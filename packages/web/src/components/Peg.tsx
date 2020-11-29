import { Move, GameTileState } from '@quinnturner/peg-game-engine';
import {
  SelectableGameTileState,
  SelectedGameTileState,
} from '../SelectableGameTileState';

export type PegState = 'OCCUPIED' | 'SELECTED' | 'VACANT';

export interface PegProps {
  key: number;
  move: Move;
  state: SelectableGameTileState;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    move: Move,
  ) => void;
}

export function Peg({ key, state, onClick, move }: PegProps): JSX.Element {
  if (state === GameTileState.NON_EXISTENT) {
    return <div key={key} className="p-8 m-1 inline"></div>;
  }

  const bgColor =
    state === SelectedGameTileState.SELECTED
      ? 'bg-green-700'
      : state === GameTileState.OCCUPIED
      ? 'bg-blue-700'
      : 'bg-black';

  return (
    <button
      key={key}
      className={`rounded-full ${bgColor} p-8 m-1`}
      onClick={(e) => onClick(e, move)}
    ></button>
  );
}
