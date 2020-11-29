import { Move } from '@quinnturner/peg-game-engine';
import { SelectableGameTileState } from '../SelectableGameTileState';
import BoardBackground from '../assets/wood-background.jpg';

import { Peg } from './Peg';

export interface BoardProps {
  pegStates: SelectableGameTileState[][];
  onClickPeg: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    move: Move,
  ) => void;
}

export function Board({ pegStates, onClickPeg }: BoardProps): JSX.Element {
  return (
    <div className="relative">
      <div className="relative">
        <img
          alt="Wooden board for the game"
          src={BoardBackground}
          className="rounded-md bg-cover"
        />
      </div>
      <div className="absolute top-1 left-1">
        {pegStates.map((xPegStates, y) => (
          <div>
            {xPegStates.map((s, x) => (
              <Peg state={s} key={x} move={{ x, y }} onClick={onClickPeg} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
