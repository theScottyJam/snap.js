const isPrimitive = value => value !== Object(value);

const isPlainObject = value => (
  value != null &&
  [null, Object.prototype].includes(Object.getPrototypeOf(value))
);

function isEqual(value1, value2) {
  // Each type corresponds to a particular comparison algorithm
  const getType = value => {
    if (isPrimitive(value)) return 'primitive';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Map) return 'map';
    if (isPlainObject(value)) return 'plainObject';
    throw new Error(`deeply comparing an instance of type ${value.constructor?.name} is not supported.`);
  };

  const type = getType(value1);
  if (type !== getType(value2)) {
    return false;
  }

  if (type === 'primitive') {
    return (
      value1 === value2 ||
      (Number.isNaN(value1) && Number.isNaN(value2))
    );
  } else if (type === 'array') {
    return (
      value1.length === value2.length &&
      value1.every((iterValue, i) => isEqual(iterValue, value2[i]))
    );
  } else if (type === 'map') {
    // In this particular implementation, map keys are not
    // being deeply compared, only map values.
    return (
      value1.size === value2.size &&
      [...value1].every(([iterKey, iterValue]) => {
        return value2.has(iterKey) && isEqual(iterValue, value2.get(iterKey));
      })
    );
  } else if (type === 'plainObject') {
    const value1AsMap = new Map(Object.entries(value1));
    const value2AsMap = new Map(Object.entries(value2));
    return (
      value1AsMap.size === value2AsMap.size &&
      [...value1AsMap].every(([iterKey, iterValue]) => {
        return value2AsMap.has(iterKey) && isEqual(iterValue, value2AsMap.get(iterKey));
      })
    );
  } else {
    throw new Error('Unreachable');
  }
}

test('comparing values of different types', () => {
  expect(!isEqual({}, null)).toBe(true); // Even though `typeof {}` is `null`, these should clearly not be equal
  expect(!isEqual({}, undefined)).toBe(true);
  expect(!isEqual(null, undefined)).toBe(true);
  expect(!isEqual({}, 2)).toBe(true);
  expect(!isEqual(2, 2n)).toBe(true);
  expect(!isEqual(new Map(), {})).toBe(true);
});

test('comparing primitives', () => {
  expect(isEqual(2, 2)).toBe(true);
  expect(!isEqual(2, 3)).toBe(true);

  expect(isEqual('x', 'x')).toBe(true);
  expect(!isEqual('x', 'xx')).toBe(true);

  const s = Symbol('mySymb');
  expect(isEqual(s, s)).toBe(true);
  expect(!isEqual(s, Symbol('mySymb'))).toBe(true);

  expect(isEqual(true, true)).toBe(true);
  expect(!isEqual(true, false)).toBe(true);

  expect(isEqual(undefined, undefined)).toBe(true);
  expect(isEqual(null, null)).toBe(true);
});

test('comparing objects', () => {
  expect(isEqual({ x: { y: 2 } }, { x: { y: 2 } })).toBe(true);
  expect(isEqual({ x: 2, y: 3 }, { y: 3, x: 2 })).toBe(true);
  expect(!isEqual({ x: { y: 2 } }, { x: { y: 3 } })).toBe(true);
  expect(!isEqual({ x: { y: 2 } }, { x: { y: 2, z: 2 } })).toBe(true);
});

test('comparing arrays', () => {
  expect(isEqual([1, 2], [1, 2])).toBe(true);
  expect(isEqual([[1, 2]], [[1, 2]])).toBe(true);

  expect(!isEqual([[1, 2]], [[1, 3]])).toBe(true);
  expect(!isEqual([1, 2], [1, 3])).toBe(true);
  expect(!isEqual([1, 2], [1, 2, 3])).toBe(true);
});

test('comparing maps', () => {
  expect(
    isEqual(
      new Map([
        [1, 'A'],
        [2, 'B'],
      ]),
      new Map([
        [2, 'B'],
        [1, 'A'],
      ]),
    ),
  ).toBe(true);
  expect(isEqual(new Map([[1, { x: 2 }]]), new Map([[1, { x: 2 }]]))).toBe(true);

  expect(!isEqual(new Map([[1, { x: 2 }]]), new Map([[1, { x: 1 }]]))).toBe(true);
  expect(
    !isEqual(
      new Map([
        [1, 'A'],
        [2, 'B'],
      ]),
      new Map([
        [1, 'A'],
        [2, 'C'],
      ]),
    ),
  ).toBe(true);
  expect(
    !isEqual(
      new Map([
        [1, 'A'],
        [2, 'B'],
      ]),
      new Map([
        [1, 'A'],
        [3, 'B'],
      ]),
    ),
  ).toBe(true);
  expect(
    !isEqual(
      new Map([
        [1, 'A'],
        [2, 'B'],
      ]),
      new Map([
        [1, 'A'],
        [2, 'B'],
        [3, 'C'],
      ]),
    ),
  ).toBe(true);
});
