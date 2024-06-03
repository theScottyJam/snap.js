```javascript
function upperFirst([first='', ...rest]) {
  return first.toUpperCase() + rest.join('');
}
```

The above implementation is carefully implemented to rely on the iterator protocol to split the string into separate characters (destructuring syntax uses the iterator protocol under the hood). This is done because iteration will properly split a string into characters while string indexing and slicing can cause you to accidentally split a string in between a character (e.g. `const firstChar = '🚀🚀'[0];` produces an invalid character while `const [firstChar] = '🚀🚀';` will properly retrieve the first character as `🚀`).

If you need to support internationalization, swap `.toUpperCase()` with [`.toLocalUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase), and, if needed, provide the target language as an argument. This solution isn't perfect - read [this great post for a more nuanced exploration on internationalization and casing](https://stackoverflow.com/a/53930826/7696223).
