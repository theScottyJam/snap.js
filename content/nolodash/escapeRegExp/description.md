JavaScript has a new, native method for escaping regular expressions, [RegExp.escape()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/escape). Please check browser compatibility before using it, and if needed, use a polyfill.

```javascript
console.log(RegExp.escape('[lodash](https://lodash.com/)'));
// => \[lodash\]\(https\x3a\/\/lodash\.com\/\)
```

If you strip out Lodash's automatic coercion behavior and what-not, its escape function becomes essentially the following:

```javascript
function escapeRegExp(string) {
  const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  return string.replace(reRegExpChar, '\\$&');
}
```

While this mostly works, [MDN warns against solutions like this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/escape).

> don't try to re-implement \[RegExp.escape()]'s functionality by, \[...] insert\[ing] a `\` before all syntax characters. `RegExp.escape()` is designed to use escape sequences that work in many more edge cases/contexts than hand-crafted code is likely to achieve.
