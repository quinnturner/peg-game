export default interface GameRules {
  adjacentRequired: boolean;
  maxNumOfPegsCanTake: number;
  minNumOfPegsCanTake: number;
  xOnly: boolean;
}
/** The minimum number of pegs possible on the x-axis. */
export const MIN_X = 2;
/** The minimum number of pegs possible on the y-axis. */
export const MIN_Y = 2;
/** The largest number of pegs possible on the x-axis. The number 10 is arbitrary, but no game would be made that large in real life. */
export const MAX_X = 10;
/** The largest number of pegs possible on the y-axis. The number 10 is arbitrary, but no game would be made that large in real life. */
export const MAX_Y = 10;
