```javascript
minuend - subtrahend;
```

One reason `_.subtract()` exists, is because it's a ready-made function, that can easily be passed into other functions, like this:

```javascript
_.reduce([10, 3, 4], _.subtract);
// => 3
```

When Lodash was first born, the only alternative at the time would be to create an entire function, using the `function` keyword.

```javascript
_.reduce([10, 3, 4], function (a, b) {
  return a - b;
});
```

Since then, ES6 came out with arrow functions, allowing you to define these sorts of functions in a much more concise way.

```javascript
_.reduce([10, 3, 4], (a, b) => a - b);
```
