To check if something is empty, you can simply use the API provided by the specific object type you have.

For array and strings, use the `.length` property.

```javascript
myArray.length === 0;
myString.length === 0;
```

For maps and sets, use the `.size` property.

```javascript
new Map().size === 0;
new Set().size === 0;
```

You can check if an object has zero non-inherited string keys by checking the length of `Object.keys()`.

```javascript
Object.keys({}).length === 0;
```

Lodash treats `undefined` and `null` as empty, while treating all other non-string primitives as non-empty. This distinction is technically nonsense. Only containers can be empty. If your piece of data can't hold anything, then it _can't_ be empty or non-empty, instead it's simply an invalid input. It's true that a `null` or `undefined` can be used to represent the absence of a value, but these pieces of data aren't in-and-of-themselves _empty_. In any case, if you want to check if something is `undefined` or `null`, you can just use `value === undefined` or `value === null`.

If you want to check if an [array-like value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array-like_objects) (e.g. the argument object, typed arrays, etc) is empty, check the `.length` property, the same way you would with a normal array.

```javascript
myArrayLikeValue.length === 0;
```

Despite what Lodash's documentation seems to imply, `_.isEmpty()` does not work with _any_ array-like value. Take, for example, `{ length: 0 }`, which is an array-like object (it passes Lodash's `_.isArrayLike()` check), however, when passed into `_.isEmpty()`, Lodash will incorrectly state that this array-like value is not empty. The reason for this odd behavior is simply because this function has been overloaded with too many behaviors - while it's true that `{ length: 0 }` is an empty array-like object, it's also true that this is not an empty object, and Lodash has decided to let the "is this an empty object" behavior take precedence over the "is this an empty array-like value" behavior for this specific scenario. If you want to know the details of how it decides which behavior to follow, feel free to [read its source code](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11479).
