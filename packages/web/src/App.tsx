import { useEffect, useState } from 'react';

import {
  Game,
  Move,
  GameTileState,
  boardTrapezoid5x3,
  boardSquareWithPoint4x3,
  GameRules,
  GameState,
} from '@quinnturner/peg-game-engine';
import { MoveTreeNode } from '@quinnturner/peg-game-solver';

import { Board } from './components/Board';
import {
  SelectableGameTileState,
  SelectedGameTileState,
} from './SelectableGameTileState';

export type PlayerConfiguration = 'p-p' | 'p-c' | 'c-p';

type GameStartState = {
  playerTypes: PlayerConfiguration;
  rules: GameRules;
  board: BoardName;
};

type BoardName = '5x3-trapezoid' | '5x4-strange';

function boardMapper(boardName: BoardName): GameTileState[][] {
  switch (boardName) {
    case '5x3-trapezoid':
      return boardTrapezoid5x3;
    case '5x4-strange':
      return boardSquareWithPoint4x3;
  }
}

type FullGameState = {
  playerTypes: PlayerConfiguration;
  game: Game;
  currentNode: MoveTreeNode;
};

function App() {
  const [gameStartState, setGameStartState] = useState<GameStartState>({
    playerTypes: 'p-c',
    rules: {
      adjacentRequired: true,
      minNumOfPegsCanTake: 1,
      maxNumOfPegsCanTake: 2,
      xOnly: true,
    },
    board: '5x3-trapezoid',
  });

  const [pegStates, setPegStates] = useState<SelectableGameTileState[][]>(
    boardTrapezoid5x3,
  );
  const [gameState, setGameState] = useState<FullGameState | undefined>(
    undefined,
  );

  const onClickPeg = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    move: Move,
  ) => {
    if (!gameState?.game) {
      return;
    }
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

  const onClickPlay = () => {
    const board = boardMapper(gameStartState.board);
    const game = new Game(gameStartState.rules, board);
    setGameState({
      playerTypes: gameStartState.playerTypes,
      game,
      currentNode: {},
    });
  };

  useEffect(() => {
    if (!gameState?.game?.state) {
      return;
    }
    const isComputersMove =
      (gameState.playerTypes === 'p-c' &&
        gameState.game.state === GameState.PLAYER_TWOS_TURN) ||
      (gameState.playerTypes === 'c-p' &&
        gameState.game.state === GameState.PLAYER_ONES_TURN);
    if (isComputersMove) {
      // const move = dfs(gameState.game, gameState.currentNode);
    }
  }, [gameState?.playerTypes, gameState?.game, gameState?.currentNode]);

  return (
    <div className="App">
      <div className="w-screen h-screen bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Peg game</h1>
            <p className="text-xl font-medium text-gray-700">
              Authors: Quinn Turner &amp; Blair Mikkelsen
            </p>
          </div>
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <Board
                  game={gameState?.game}
                  onClickPeg={onClickPeg}
                  pegStates={pegStates}
                />
              </div>
              <div className="mt-5 md:mt-0 md:col-span-1">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6">
                        <label
                          htmlFor="player-config"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Player Configuration
                        </label>
                        <select
                          id="player-config"
                          name="player-config"
                          value={gameStartState.playerTypes}
                          onChange={(e) => {
                            setGameStartState((s) => ({
                              ...s,
                              playerTypes: e.target
                                .value as PlayerConfiguration,
                            }));
                          }}
                          className="mt-1 appearance-none block w-full py-3 px-4 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
                        >
                          <option value="p-c">Player vs. Computer</option>
                          <option value="c-p">Computer vs. Player</option>
                          <option value="p-p">Player vs. Player</option>
                        </select>
                      </div>
                      <div className="col-span-6">
                        <label
                          htmlFor="max-pegs"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Max. pegs a player can take
                        </label>
                        <input
                          type="number"
                          name="max-pegs"
                          id="max-pegs"
                          value={gameStartState.rules.maxNumOfPegsCanTake}
                          onChange={(e) => {
                            setGameStartState((s) => ({
                              ...s,
                              rules: {
                                ...s.rules,
                                maxNumOfPegsCanTake: Math.min(
                                  Math.max(Number.parseInt(e.target.value), 2),
                                  10,
                                ),
                              },
                            }));
                          }}
                          className="mt-1 appearance-none block w-full py-3 px-4 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
                        />
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="allow-y"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Allow vertical moves
                        </label>
                        <input
                          type="checkbox"
                          name="allow-y"
                          id="allow-y"
                          checked={!gameStartState.rules.xOnly}
                          onChange={(e) => {
                            setGameStartState((s) => ({
                              ...s,
                              rules: {
                                ...s.rules,
                                xOnly: !e.target.checked,
                              },
                            }));
                          }}
                          className="mt-1 block h-4 w-4 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
                        />
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="peg-layout"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Peg layout
                        </label>
                        <select
                          id="peg-layout"
                          name="peg-layout"
                          value={gameStartState.board}
                          onChange={(e) => {
                            setGameStartState((s) => ({
                              ...s,
                              board: e.target.value as BoardName,
                            }));
                          }}
                          className="mt-1 appearance-none block w-full py-3 px-4 leading-tight text-gray-700 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
                        >
                          <option value="5x3-trapezoid">5x3 trapezoid</option>
                          <option value="5x4-strange">5x4 strange</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      onClick={onClickPlay}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Play!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
