```javascript
Math.max(...array);
```

There's a couple of very minor differences in behavior between Lodash's `_.max()`, and JavaScript's native `Math.max()` (apart from the fact that you have to spread your array into JavaScript's version).

1. In Lodash's version, if you provide a falsey value, `undefined` will be returned. In JavaScript, if you try to spread a falsey value into `Math.max()`, you'll get a runtime error, because falsey values aren't iterable. In practice, this difference shouldn't matter much - you should know the types of values you're trying to use, and if you suspect that it might be falsey, just check for that before calling `Math.max()`, instead of checking if the result is undefined after calling `_.max()`.

2. In Lodash's version, if you provide an empty array, `undefined` is returned. In JavaScript, if you spread an empty array, or you provide no arguments, `-Infinity` is returned. JavaScript's `-Infinity`, while, at first, may sound odd, can actually be a useful return value. It allows you to cleanly write many algorithms capable of operating on empty arrays, without having to explicitly check if the array is empty. Not everyone likes to write algorithms this way, but `Math.max()` gives you the option when it's wanted.