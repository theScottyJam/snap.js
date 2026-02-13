If you need to re-order arguments, just use arrow functions. It's easier to tell, at a glance, what's going on.

```javascript
function original(a, b, c) {
  return [a, b, c];
}

const rearged = (b, c, a) => original(a, b, c);

rearged('b', 'c', 'a')
// => ['a', 'b', 'c']
```

If you need a real `rearg()` implementation, because, perhaps the list of indices is dynamically generated, you can use the following:

```javascript
function rearg(func, indexes) {
  return (...oldArgs) => {
    const newArgs = [];
    for (let i = 0; i < indexes.length; i++) {
      newArgs[i] = oldArgs[indexes[i]];
    }
    return func(...newArgs);
  };
}

// Example Usage:

const rearged = _.rearg((a, b, c) => {
  return [a, b, c];
}, [2, 0, 1]);

rearged('b', 'c', 'a')
// => ['a', 'b', 'c']
```
