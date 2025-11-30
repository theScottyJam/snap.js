`_.after()` was a convenient helper function back when asynchronous programming was done primarily through callbacks - it allowed you execute a function after a number of asynchronous tasks have finished, as shown in this example from their documentation.

<!-- eslint-skip -->
```javascript
var saves = ['profile', 'settings'];

var done = _.after(saves.length, function() {
  console.log('done saving!');
});

_.forEach(saves, function(type) {
  asyncSave({ 'type': type, 'complete': done });
});
// => Logs 'done saving!' after the two async saves have completed.
```

Now days, the `asyncSave()` function from the example would typically be written to return a promise instead of accepting a callback (and if its not, you can convert it to a promise-based function yourself with the [Promise constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise)). With a promise-based `asyncSave()`, we can rewrite this example to just use `Promise.all()` instead.

```javascript
await Promise.all([
  asyncSave({ type: 'profile' }),
  asyncSave({ type: 'settings' }),
]);

console.log('done saving!');
// => Logs 'done saving!' after the two async saves have completed.
```

If the `saves` array is dynamically generated, you can use the [`Promise.all()` + `array.map()` pattern](https://stackoverflow.com/a/37576787/7696223).

```javascript
const saves = getAnArrayFromSomewhere();

await Promise.all(saves.map(async type => {
  await asyncSave({ type });
}));

console.log('done saving!');
// => Logs 'done saving!' after the two async saves have completed.
```

That being said, if you need a utility that acts like Lodash's `_.after()`, here's how you could code it up:

```javascript
function after(n, func) {
  let callCount = 0;
  return function (...args) {
    callCount++;
    if (callCount < n) {
      return;
    }

    // Using .call() may be overkill.
    // You could just do `return func(...args)` if you
    // don't need to worry about preserving the "this" argument.
    return func.call(this, ...args);
  };
}
```
