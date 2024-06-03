```javascript
function upperCase(string) {
  const words = string.split(/\s+/);
  return words.map(word => word.toUpperCase()).join(' ');
}
```

The above generates the word list by simply splitting on whitespace characters. Refer to [the entry for `_.words()`](#!/nolodash/words) for alternative ways to extract words from text (which includes information on dealing with different languages).

If you need to support internationalization, swap `.toUpperCase()` with [`.toLocalUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase), and, if needed, provide the target language as an argument to these functions. This solution isn't perfect - read [this great post for a more nuanced exploration on internationalization and casing](https://stackoverflow.com/a/53930826/7696223).

For reference, Lodash's algorithm is implemented roughly as follows:
* [Deburr](#!/nolodash/deburr) the string (which mostly means that accent marks are removed from characters).
* Removes apostrophes (the ' and ’ characters).
* Split the string into words using the algorithm that powers [`_.words()`](#!/nolodash/words).
* upper case each word with `.toUpperCase()`.