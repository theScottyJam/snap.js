```javascript
value < other
```

One reason `_.lt()` exists, is because it's a ready-made function, that can easily be passed into other functions, like this:

```javascript
_.zipWith([1, 2, 3], [3, 2, 1], _.lt)
// => [true, false, false]
```

When Lodash was first born, the only alternative at the time would be to create an entire function, using the `function` keyword.

```javascript
_.zipWith([1, 2, 3], [3, 2, 1], function (a, b) {
  return a < b;
})
```

Since then, ES6 came out with arrow functions, allowing you to define these sorts of functions in a much more concise way.

```javascript
_.zipWith([1, 2, 3], [3, 2, 1], (a, b) => a < b)
```
