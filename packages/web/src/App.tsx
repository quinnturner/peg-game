import { useState } from 'react';

import {
  Move,
  GameTileState,
  boardTrapezoid5x3,
} from '@quinnturner/peg-game-engine';

import { Board } from './components/Board';
import {
  SelectableGameTileState,
  SelectedGameTileState,
} from './SelectableGameTileState';

function App() {
  const [pegStates, setPegStates] = useState<SelectableGameTileState[][]>(
    boardTrapezoid5x3,
  );

  const onClickPeg = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    move: Move,
  ) => {
    setPegStates((s) => {
      const xStates = [...s[move.y]];
      xStates[move.x] =
        xStates[move.x] === GameTileState.OCCUPIED
          ? SelectedGameTileState.SELECTED
          : xStates[move.x] === SelectedGameTileState.SELECTED
          ? GameTileState.OCCUPIED
          : xStates[move.x] === GameTileState.NON_EXISTENT
          ? GameTileState.NON_EXISTENT
          : GameTileState.VACANT;
      const newState = [...s.slice(0, move.y), xStates, ...s.slice(move.y + 1)];
      return newState;
    });
  };

  const onClickOk = () => {};

  return (
    <div className="App">
      <div className="w-screen h-screen bg-gray-100">
        <div className="container mx-auto">
          <div>
            <Board onClickPeg={onClickPeg} pegStates={pegStates} />
          </div>
          <div>
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
      </div>
    </div>
  );
}

export default App;
