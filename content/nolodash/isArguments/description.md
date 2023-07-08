```javascript
function isArguments(value) {
  return Object.prototype.toString.call(value) === '[object Arguments]' && !(Symbol.toStringTag in value);
}
```

The above solution can technically give wrong answers if you provide an arguments object that has been mutated to contain `Symbol.toStringTag`.

```javascript
function() {
  arguments[Symbol.toStringTag] = 'badValue';
  isArguments(arguments); // false
}
```

Even Lodash's implementation can be spoofed, but under different conditions. If you run the following, you'll see that it will incorrectly claim that the provided object is an arguments object `true`.

```javascript
_.isArguments({ get [Symbol.toStringTag]() { return 'Arguments' } }); // true
```

If you're exclusively using Node, you're welcome to instead use `require('util').types.isArgumentsObject(value)` for your `isArguments` check.
