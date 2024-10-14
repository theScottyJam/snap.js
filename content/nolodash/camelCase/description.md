```javascript
function camelCase(string) {
  const capitalize = ([first='', ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
  const [firstWord, ...remainingWords] = string.split(' ');
  return [
    firstWord.toLowerCase(),
    ...remainingWords.map(capitalize),
  ].join('');
}
```

The above generates the word list by simply splitting on space characters. Refer to [the entry for `_.words()`](#!/nolodash/words) for alternative ways to extract words from text (which includes information on dealing with different languages).

Refer to the [`_.capitalize()` entry](#!/nolodash/capitalize) to learn more about its implementations, and alternative ways to implement it in a more i18n-friendly manner.

If you need to support internationalization, swap `.toUpperCase()`/`.toLowerCase()` with [`.toLocalUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase)/[`.toLocaleLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase), and, if needed, provide the target language as an argument to these functions. This solution isn't perfect - read [this great post for a more nuanced exploration on internationalization and casing](https://stackoverflow.com/a/53930826/7696223).

For reference, Lodash's algorithm is implemented roughly as follows:
* [Deburr](#!/nolodash/deburr) the string (which mostly means that accent marks are removed from characters).
* Removes apostrophes (the ' and ’ characters).
* Split the string into words using the algorithm that powers [`_.words()`](#!/nolodash/words).
* Runs the first letter of each word (except the first) through `.toUpperCase()`, and runs the rest of the characters through `.toLowerCase()`.
