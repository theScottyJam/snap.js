#!/usr/bin/env -S node --test

// If the code in description.md gets modified, you can copy-paste
// the modified version below then run this test file to make
// sure it still behaves correctly.
//
// Run this file with `node --test ./tests.js`

const test = require('node:test');
const assert = require('node:assert').strict;

// ---------- System Under Test ---------- //

const isPrimitive = value => value !== Object(value);

const isPlainObject = value =>
  value != null &&
  [null, Object.prototype].includes(Object.getPrototypeOf(value));

function isEqual(value1, value2) {
  // Each type corresponds to a particular comparison algorithm
  const getType = value => {
    if (isPrimitive(value)) return 'primitive';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Map) return 'map';
    if (value instanceof Set) return 'set';
    if (isPlainObject(value)) return 'plainObject';
    throw new Error(
      `deeply comparing an instance of type ${value1.constructor?.name} is not supported.`
    );
  };

  const type = getType(value1);
  if (type !== getType(value2)) {
    return false;
  }

  if (type === 'primitive') {
    return value1 === value2 || (Number.isNaN(value1) && Number.isNaN(value2));
  } else if (type === 'array') {
    return (
      value1.length === value2.length &&
      value1.every((iterValue, i) => isEqual(iterValue, value2[i]))
    );
  } else if (type === 'map') {
    // In this particular implementation, map keys are not being deeply compared, only map values.
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
        return (
          value2AsMap.has(iterKey) &&
          isEqual(iterValue, value2AsMap.get(iterKey))
        );
      })
    );
  } else {
    throw new Error(`Unreachable`);
  }
}

// ---------- Test Cases ---------- //

test('comparing values of different types', t => {
  assert(!isEqual({}, null)); // Even though `typeof {}` is `null`, these should clearly not be equal
  assert(!isEqual({}, undefined));
  assert(!isEqual(null, undefined));
  assert(!isEqual({}, 2));
  assert(!isEqual(2, 2n));
  assert(!isEqual(new Map(), {}));
  assert(!isEqual(new Map(), new Set()));
});

test('comparing primitives', t => {
  assert(isEqual(2, 2));
  assert(!isEqual(2, 3));

  assert(isEqual('x', 'x'));
  assert(!isEqual('x', 'xx'));

  const s = Symbol('mySymb');
  assert(isEqual(s, s));
  assert(!isEqual(s, Symbol('mySymb')));

  assert(isEqual(true, true));
  assert(!isEqual(true, false));

  assert(isEqual(undefined, undefined));
  assert(isEqual(null, null));
});

test('comparing objects', t => {
  assert(isEqual({ x: { y: 2 } }, { x: { y: 2 } }));
  assert(isEqual({ x: 2, y: 3 }, { y: 3, x: 2 }));
  assert(!isEqual({ x: { y: 2 } }, { x: { y: 3 } }));
  assert(!isEqual({ x: { y: 2 } }, { x: { y: 2, z: 2 } }));
});

test('comparing arrays', t => {
  assert(isEqual([1, 2], [1, 2]));
  assert(isEqual([[1, 2]], [[1, 2]]));

  assert(!isEqual([[1, 2]], [[1, 3]]));
  assert(!isEqual([1, 2], [1, 3]));
  assert(!isEqual([1, 2], [1, 2, 3]));
});

test('comparing maps', t => {
  assert(
    isEqual(
      new Map([
        [1, 'A'],
        [2, 'B'],
      ]),
      new Map([
        [2, 'B'],
        [1, 'A'],
      ])
    )
  );
  assert(isEqual(new Map([[1, { x: 2 }]]), new Map([[1, { x: 2 }]])));

  assert(!isEqual(new Map([[1, { x: 2 }]]), new Map([[1, { x: 1 }]])));
  assert(
    !isEqual(
      new Map([
        [1, 'A'],
        [2, 'B'],
      ]),
      new Map([
        [1, 'A'],
        [2, 'C'],
      ])
    )
  );
  assert(
    !isEqual(
      new Map([
        [1, 'A'],
        [2, 'B'],
      ]),
      new Map([
        [1, 'A'],
        [3, 'B'],
      ])
    )
  );
  assert(
    !isEqual(
      new Map([
        [1, 'A'],
        [2, 'B'],
      ]),
      new Map([
        [1, 'A'],
        [2, 'B'],
        [3, 'C'],
      ])
    )
  );
});
