```javascript
function isNative(value) {
  if (typeof value !== 'function') {
    return false;
  }

  const nativeFnPattern = /^function.*?\(\) \{ \[native code\] \}$/;
  const valueAsString = Function.prototype.toString.call(value);
  return nativeFnPattern.test(valueAsString);
}
```

Some good things to know about both this implementation and Lodash's `_.isNative()`:
* The return value of `yourNonNativeFunction.bind()` is considered a native function.
* Not all of Node's built-in functions will be considered native, for example, in Node 18, `Function.prototype.toString.call(setTimeout)` will return the source code for the function instead of the regular `function setTimeout() { [native code] }`. This is likely due to the fact that many of Node's standard library functions are implemented in JavaScript itself.

On [Lodash's website](https://lodash.com/docs/4.17.15#isNative) you'll also see a warning about how their `_.isNative()` functions are unable to tell the difference between a core.js function and a native one, so if it detects that you are using core.js, their `_.isNative()` will always throw. The above `isNative()` is also unable to tell the difference between a core.js polyfilled function and a native one.

Every code snippet provided in Snap.js is operating under the assumption that the standard library is pristine and untouched, and the above `isNative()` operates under the same assumption. As long as no one is monkey-patching the standard library, the `isNative()` function will work with any modern JavaScript engine just fine and can't be spoofed. The reason Core.js is capable of getting around these checks is because it monkey-patches `Function.prototype.toString` and replaces it with its own implementation. If you're worried about running in an environment where monkey-patching might be happening, the correct way to handle this (for any of the snap.js functions, and any code you write in general) is to locally cache the built-in functions you need when your code first loads. Then, as long as your library is imported before any monkey-patching happens, your code won't be affected by the monkey-patching at all. If your library loads after monkey patching has happened, then all bets are off - you just have to trust that your host was responsible with how they've been messing with the globals.

Here's an example of how you can make the `isNative()` function in a more robust manner, so that if this module loads before core-js (or any other library that messes with the globals), it'll still work just fine. (Writing robust code as shown above adds a big toll on the readability and maintainability of your codebase - only use techniques like this when it's actually necessary).

```javascript
const callBind = fn => fn.call.bind(fn);

const functionToString = callBind(Function.prototype.toString);
const regExpTest = callBind(RegExp.prototype.test);

function isNative(value) {
  if (typeof value !== 'function') {
    return false;
  }

  const nativeFnPattern = /^function.*?\(\) \{ \[native code\] \}$/;
  const valueAsString = functionToString(value);
  return regExpTest(nativeFnPattern, valueAsString);
}
```

Lodash actually follows this robust code pattern throughout its library, it has just chosen to additionally check for the presence of core.js and throw an error if it found that core.js was loaded, just in case core.js loaded before lodash.
