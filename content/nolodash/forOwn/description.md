If you wish to iterate over both keys and values:

```javascript
for (const [key, value] of Object.entries(object)) {
  ...
}
```

If, instead, you just want values, you can use `Object.values(object)`.

```javascript
for (const value of Object.values(object)) {
  ...
}
```

And if you just want keys, you can use `Object.keys(object)`.

```javascript
for (const key of Object.keys(object)) {
  ...
}
```

You'll find the `.forEach()` method to be very popular in the JavaScript community as well.

```javascript
Object.entries(object).forEach(([key, value]) => {

});
```

Using `.forEach()` will certainly feel closer to Lodash's `_.forOwn()`, but it does have a number of drawbacks:
* You can't use `break` in a `.forEach()`. (You can mimic `continue` via an early return).
* `.forEach()` doesn't provide proper support for `await`. If you need to run tasks in parallel, use `await Promise.all(items.map(...))`, and if you want to run tasks in a series, you can just use a for-of loop.
* `.forEach()` doesn't work with generators. You can't `yield` from inside a `.forEach()`.
* `.forEach()` only works with arrays, and any other collection that happens to implement the `.forEach()` function. `for-of` works with all iterators, including strings, the legacy `arguments` object, your own iterators made via generator functions, etc.
* `for-of` is newer than `.forEach()` and was intended to be the better version of `.forEach()`. It's a shame it's still struggling to gain traction.
