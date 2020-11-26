import { hashPartialMove } from '../src/move';

describe('Move', () => {
  it('hashes a partial move well', () => {
    const h1 = hashPartialMove({ x: 1, y: 1 });
    const h2 = hashPartialMove({ x: 1, y: 1 });
    const h3 = hashPartialMove({ x: 1, y: 2 });
    expect(h1).toBe(h2);
    expect(h1).not.toBe(h3);
  });
});
