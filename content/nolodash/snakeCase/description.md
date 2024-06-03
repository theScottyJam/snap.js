A bare-bones implementation can be done as follows:

```javascript
string.toLowerCase().replaceAll(' ', '_')

// 'Hello World'.toLowerCase().replaceAll(' ', '_')
// => 'hello_world'
```

The above assumes that each word is separated by a single space. The `' '` string can be swapped for a regular expression, such as `/\s+/g`, to cause it to separate words based on any grouping of whitespace instead.

For other ways to separate a string into words, refer to [the entry for `_.words()`](#!/nolodash/words), which includes internationalization-related information as well. After separating a string into a list of words, simply do `<list of words>.join('_').toLowerCase()` on the result to create your snake case text (or use [`.toLocaleLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase) to make it i18n-compatible)

For reference, Lodash's algorithm is implemented roughly as follows:
* [Deburr](#!/nolodash/deburr) the string (which mostly means that accent marks are removed from characters).
* Removes apostrophes (the ' and ’ characters).
* Split the string into words using the algorithm that powers [`_.words()`](#!/nolodash/words).
* lower case each word with `.toLowerCase()`.
* Joins the words back together with a `_` character.
