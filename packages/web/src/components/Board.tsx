import { Game, Move } from '@quinnturner/peg-game-engine';
import { SelectableGameTileState } from '../SelectableGameTileState';
import BoardBackground from '../assets/wood-background.jpg';

import { Peg } from './Peg';

export interface BoardProps {
  game: Game | undefined;
  pegStates: SelectableGameTileState[][];
  onClickPeg: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    move: Move,
  ) => void;
}

export function Board({
  game,
  pegStates,
  onClickPeg,
}: BoardProps): JSX.Element {
  return (
    <div className="relative">
      <div className="relative">
        {!game && (
          <div
            className="absolute top-0 left-0 w-full h-full z-10"
            style={{ backgroundColor: `rgba(128,128,128,.75)` }}
          ></div>
        )}

        <img
          alt="Wooden board for the game"
          src={BoardBackground}
          className="rounded-md bg-cover"
        />
      </div>
      <div className="absolute top-0" style={{ width: 728, height: 482 }}>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-1 text-3xl font-bold text-gray-900">
            <h2>P 1</h2>
          </div>
          <div className="col-span-4 justify-center items-center">
            {pegStates.map((xPegStates, y) => (
              <div>
                {xPegStates.map((s, x) => (
                  <Peg state={s} move={{ x, y }} onClick={onClickPeg} />
                ))}
              </div>
            ))}

            <div className="flex">
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                OK
              </button>
            </div>
          </div>

          <div className="col-span-1 text-3xl font-bold text-gray-900">
            <h2>P 2</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
