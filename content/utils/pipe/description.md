# Examples

```javascript
// Outputs 22
pipe(
  42,
  x => x / 2,
  x => x + 1,
);
```

For those who like [point-free programming](https://en.wikipedia.org/wiki/Tacit_programming), the pipe function is an indispensable tool to help achieve it.

Even if you aren't into point-free programming, a pipe function is still handy to have, as it allows you to interject your own helper functions into the middle of what normally is a fluent API, and still get the nice non-nested benefit of a fluent API. For example:

```javascript
function popped(array) {
  const newArray = [...array];
  newArray.pop();
  return newArray;
}

// Outputs [2, 4]
pipe(
  [1, 2, 3],
  popped,
  arr => arr.map(x => x * 2),
);
```