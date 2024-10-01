function range(...args) {
  // Adds support for passing in a single argument.
  if (args.length === 1) {
    const end = args[0];
    return range(0, end);
  }
  const [start, end, step = 1] = args;

  // A couple of checks to prevent accidental infinite loops.
  // Number.isFinite() is making sure the values are numbers, and they aren't NaN or Infinity.
  if (step === 0 || ![start, end, step].every(n => Number.isFinite(n))) {
    throw new Error('Received an invalid argument.');
  }

  const result = [];
  if ( step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }
  return result;
}

describe('range()', () => {
  it('treats a single argument as the stop argument', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it('accepts floats as a single argument', () => {
    expect(range(4.5)).toEqual([0, 1, 2, 3, 4]);
  });

  it('returns an empty array when given a non-positive single argument', () => {
    expect(range(0)).toEqual([]);
    expect(range(-5)).toEqual([]);
  });

  it('can accept a start and stop argument', () => {
    expect(range(2, 5)).toEqual([2, 3, 4]);
  });

  it('can accept a start, stop, and step argument', () => {
    expect(range(4, 10, 2)).toEqual([4, 6, 8]);
  });

  it('can iterate backwards', () => {
    expect(range(5, 2, -1)).toEqual([5, 4, 3])
  });

  it('can iterate over floats', () => {
    expect(range(3, 5, 0.5)).toEqual([3, 3.5, 4, 4.5])
  });

  it('return an empty array if the step is pointed in the wrong direction', () => {
    expect(range(2, 4, -1)).toEqual([])
    expect(range(4, 2)).toEqual([])
  });

  it('return an empty array if the stop is already at the start', () => {
    expect(range(4, 4)).toEqual([])
    expect(range(4, 4, -1)).toEqual([])
  });

  it('throws when any of the arguments are not a finite number', () => {
    expect(() => range(-Infinity)).toThrow('invalid argument');
    expect(() => range(NaN)).toThrow('invalid argument');
    expect(() => range('23')).toThrow('invalid argument');

    expect(() => range(Infinity, 5, 2)).toThrow('invalid argument');
    expect(() => range(2, NaN, 3)).toThrow('invalid argument');
    expect(() => range(1, 2, '23')).toThrow('invalid argument');
  });
});
