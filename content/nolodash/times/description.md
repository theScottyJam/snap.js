```javascript
Array.from({ length: n }, (_, i) => iteratee(i))

// Concrete example:
Array.from({ length: 5 }, (_, i) => i * 10) // => [0, 10, 20, 30, 40]
```

How it works: `Array.from()` expects an array-like (or an iterable) as the first argument and a mapping function as the second. `{ length: n }` is a valid array-like object that is of length `n` and has no elements in it. The mapping function receives, as the second argument, the current item number geing generated.

Here's another way to accomplishing the same thing in a slightly different style:

```javascript
new Array(n).fill().map((_, i) => iteratee(i)) // => [1, 2, 3, 4, 5]
```

`new Array(n)` creates array holes, which are an emptiness state that is different from `undefined` and `null`, that have an inconsistent iteration behavior - some array methods treat holes like `undefined` and others will skip over them entirely. Because of this, it is generally advisable to avoid array holes and `new Array(n)`. The use of `.fill()` right after `new Array(n)` will cause the array holes to immediately be plugged with `undefined`, fixing the problem. If you want to be strict about avoiding array holes, then you may want to avoid this solution, preferring to instead use the `Array.from()` solution. Alternatively, you may see `new Array(n).fill()` as an acceptable exception to the "avoid array holes" guidelines and be ok with this solution.
