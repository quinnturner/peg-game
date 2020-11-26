/**
 * combinatorics.js
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  @author: Dan Kogai <dankogai+github@gmail.com>
 *
 *  References:
 *  @link: http://www.ruby-doc.org/core-2.0/Array.html#method-i-combination
 *  @link: http://www.ruby-doc.org/core-2.0/Array.html#method-i-permutation
 *  @link: http://en.wikipedia.org/wiki/Factorial_number_system
 */

// This is a MODIFIED version of combinatorics.js
// It removes all references to BigInt and tries to improve type-safety.
// This was because we will never get into issues using BigInt due to our general usage.
// Also, it prevents issues with Jest since combinatorics.js uses ESM, which Jest doesn't like.

export const version = '1.4.5';
/**
 * calculates `P(n, k)`.
 *
 * @link https://en.wikipedia.org/wiki/Permutation
 */
export function permutation(n: number, k: number) {
  if (n < 0) throw new RangeError(`negative n is not acceptable`);
  if (k < 0) throw new RangeError(`negative k is not acceptable`);
  if (0 == k) return 1;
  if (n < k) return 0;
  let p = 1;
  while (k--) p *= n--;
  return p;
}
/**
 * calculates `C(n, k)`.
 *
 * @link https://en.wikipedia.org/wiki/Combination
 */
export function combination(n: number, k: number) {
  if (0 == k) return 1;
  if (n == k) return 1;
  if (n < k) return 0;
  const P = permutation;
  const c = P(n, k) / P(k, k);
  return c;
}
/**
 * calculates `n!` === `P(n, n)`.
 *
 * @link https://en.wikipedia.org/wiki/Factorial
 */
export function factorial(n: number) {
  return permutation(n, n);
}
/**
 * returns the factoradic representation of `n`, least significant order.
 *
 * @link https://en.wikipedia.org/wiki/Factorial_number_system
 * @param {number} l the number of digits
 */
export function factoradic(n: number, l = 0) {
  if (n < 0) return undefined;
  let [bn, bf] = [n, 1];
  if (!l) {
    for (l = 1; bf < bn; bf *= ++l);
    if (bn < bf) bf /= l--;
  } else {
    bf = factorial(l);
  }
  let digits = [0];
  for (; l; bf /= l--) {
    digits[l] = Math.floor(Number(bn / bf));
    bn %= bf;
  }
  return digits;
}
/**
 * `combinadic(n, k)` returns a function
 * that takes `m` as an argument and
 * returns the combinadics representation of `m` for `n C k`.
 *
 * @link https://en.wikipedia.org/wiki/Combinatorial_number_system
 */
export function combinadic(n: number, k: number) {
  const count = combination(n, k);
  return (m: number): number[] => {
    if (m < 0 || count <= m) throw new Error('m < 0 || count <= m');
    let digits = [];
    let [a, b] = [n, k];
    let x = count - 1 - m;
    for (let i = 0; i < k; i++) {
      a--;
      while (x < combination(a, b)) a--;
      digits.push(n - 1 - a);
      x -= combination(a, b);
      b--;
    }
    return digits;
  };
}

/**
 * Base Class of `js-combinatorics`
 */
class _CBase<T, U> {
  /**
   * Common iterator
   */
  [Symbol.iterator]() {
    return (function* (it, len) {
      for (let i = 0; i < len; i++) yield it.nth(i);
    })(this, this.length);
  }
  /**
   * returns `[...this]`.
   */
  toArray() {
    return [...this];
  }
  /**
   * check n for nth
   */
  _check(n: number): number | undefined {
    if (n < 0) {
      if (this.length < -n) return undefined;
      return this.length + n;
    }
    if (this.length <= n) return undefined;
    return n;
  }
  /**
   * get the `n`th element of the iterator.
   * negative `n` goes backwards
   */
  nth(_n: number): U[] | undefined {
    return [];
  }
  /**
   * the seed iterable
   */
  seed!: T[];
  /**
   * the size (# of elements) of each element.
   */
  size!: number;
  /**
   * the number of elements
   */
  length!: number;
}
/**
 * Permutation
 */
export class Permutation<T> extends _CBase<T, T> {
  constructor(seed: Iterable<T>, size = 0) {
    super();
    this.seed = [...seed];
    this.size = 0 < size ? size : this.seed.length;
    this.length = permutation(this.seed.length, this.size);
    Object.freeze(this);
  }
  nth(n: number): T[] | undefined {
    const _n = this._check(n);
    if (_n === undefined) return undefined;
    n = _n;
    const offset = this.seed.length - this.size;
    const skip = factorial(offset);
    let digits = factoradic(n * skip, this.seed.length)!;
    let source = this.seed.slice();
    let result = [];
    for (let i = this.seed.length - 1; offset <= i; i--) {
      result.push(source.splice(digits[i], 1)[0]);
    }
    return result;
  }
}
/**
 * Combination
 */
export class Combination<T> extends _CBase<T, T> {
  comb: (arg0: number) => number[];
  constructor(seed: Iterable<T>, size = 0) {
    super();
    this.seed = [...seed];
    this.size = 0 < size ? size : this.seed.length;
    this.size = size;
    this.length = combination(this.seed.length, this.size);
    const comb = combinadic(this.seed.length, this.size);
    this.comb = comb;
    Object.freeze(this);
  }
  /**
   * returns an iterator which is more efficient
   * than the default iterator that uses .nth
   *
   * @link https://en.wikipedia.org/wiki/Combinatorial_number_system#Applications
   */
  bitwiseIterator() {
    // console.log('overriding _CBase');
    const ctor = this.length.constructor;
    const [zero, one, two] = [ctor(0), ctor(1), ctor(2)];
    const inc = (x: number) => {
      const u = x & -x;
      const v = u + x;
      return v + (((v ^ x) / u) >> two);
    };
    let x = (one << ctor(this.size)) - one; // 0b11...1
    return (function* (it, len) {
      for (let i = 0; i < len; i++, x = inc(x)) {
        var result = [];
        for (let y = x, j = 0; zero < y; y >>= one, j++) {
          if (y & one) result.push(it.seed[j]);
        }
        // console.log(`x = ${x}`);
        yield result;
      }
    })(this, this.length);
  }
  nth(n: number): T[] | undefined {
    const _n = this._check(n);
    if (_n === undefined) return undefined;
    n = _n;
    return this.comb(n).reduce((a, v) => a.concat(this.seed[v]), [] as T[]);
  }
}
