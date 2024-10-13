In one-off situations, you can simply create a function to handle it:

```javascript
// Always returns the second argument
(_, x) => x

// Always returns the fifth argument
(...args) => args[4]

// Always returns the second-to-last argument
(...args) => args.at(-2)
```

If you need a reusable function, you can use the following:

```javascript
function nthArg(n) {
  return (...args) => args.at(n);
}
```
