You can get the same effect by simply using arrow function syntax.

```javascript
const add = (x, y) => x + y;
```

```javascript
// With Lodash
const addOne = _.wrap(1, add);
addOne(2) // => 3
```

```javascript
// Without Lodash
const addOne = x => add(1, x);
addOne(2) // => 3
```

`.bind()` is technically able to accomplish this task as well. Pass in the correct `this` value as the first parameter (or `undefined` if it is not needed), then pass in any additional parameters that you want to be automatically supplied to the function being called.

```javascript
const addOne = add.bind(undefined, 1);
addOne(2) // => 3
```

I personally would recommend just going with arrow functions - there's no real advantage to using `.bind()`, and arrow functions are simpler for others to understand.
