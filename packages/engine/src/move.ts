import { MAX_X, MAX_Y } from './game-rules';

export default interface Move {
  x: number;
  y: number;
}

const max = Math.max(MAX_X, MAX_Y);

export function hashPartialMove({ x, y }: Move) {
  return x + y * max;
}
