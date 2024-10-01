You can use `Array.from(...)` to generate arrays filled with a range of numbers. Some concrete examples:

```javascript
// Same as _.range(5)
Array.from({ length: 5 }, (_, i) => i) // => [0, 1, 2, 3, 4]

// Same as _.range(2, 5)
Array.from({ length: 3 }, (_, i) => 2 + i) // => [2, 3, 4]

// Same as _.range(4, 10, 2)
Array.from({ length: 3 }, (_, i) => 4 + i*2) // => [4, 6, 8]

// Same as _.range(5, 3, -0.5)
Array.from({ length: 4 }, (_, i) => 5 - i*0.5) // => [5, 4.5, 4, 3.5]
```

How it works: `Array.from()` expects an array-like (or an iterable) as the first argument and a mapping function as the second. `{ length: n }` is a valid array-like object that is of length `n` and has no elements in it. The mapping function receives, as the second argument, the current item number geing generated.

Here's another way to accomplishing the same thing in a slightly different style:

```javascript
// Same as _.range(4, 10, 2)
// And the same as Array.from({ length: 3 }, (_, i) => 4 + i*2) // => [4, 6, 8]
new Array(3).fill().map((_, i) => 4 + i*2) // => [4, 6, 8]
```

`new Array(n)` creates array holes, which are an emptiness state that is different from `undefined` and `null`, that have an inconsistent iteration behavior - some array methods treat holes like `undefined` and others will skip over them entirely. Because of this, it is generally advisable to avoid array holes and `new Array(n)`. The use of `.fill()` right after `new Array(n)` will cause the array holes to immediately be plugged with `undefined`, fixing the problem. If you want to be strict about avoiding array holes, then you may want to avoid this solution, preferring to instead use the `Array.from()` solution. Alternatively, you may see `new Array(n).fill()` as an acceptable exception to the "avoid array holes" guidelines and be ok with this solution.

You can also use the following if you want a more complete helper function that does the math for you. Feel free to remove any pieces of this function that you don't currently need.

```javascript
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
```

This implementation isn't exactly the same as Lodash's in that if you call `range()` with a single, negative argument, Lodash will produce a range that counts down to it. To keep things a little simpler, the above implementation won't automatically swap to a step of -1, and will instead return the empty array.

There is [an upcoming "iterator range" proposal](https://github.com/tc39/proposal-iterator.range) that will introduce a native range function.
