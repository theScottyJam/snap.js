If you wish to unescape all HTML-encoded characters and you're in a browser environment, you can use the following:

```javascript
function unescapeHtmlChars(string) {
  const doc = new DOMParser().parseFromString(string, 'text/html');
  return doc.documentElement.textContent;
}
```

If your JavaScript is not running in a browser, you can instead use a library such as [jsdom](https://www.npmjs.com/package/jsdom) to mimic the DOM and provide the same kind of API, or you can use a lighter-weight package that only provides this HTML-character-unescaping functionality and nothing else, such as [html-entities](https://www.npmjs.com/package/html-entities).

Lodash's `_.unescape()` function does not unescape all HTML characters, only those that get escaped when using `_.escape()`, which means using its implementation would be insufficient in most situations. Nevertheless, if you are wanting an implementation like Lodash's, you can use the following:

```javascript
function unescapeHtmlChars(string) {
  // Unecoding "&" needs to be done last.
  // If it is done first, something like "&amp;lt;" would incorrectly
  // get unencoded to "<", when it should be "&lt;"
  return string
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&');
}
```

## Don't use unescapeHtmlChars() unless you have to

The use of `unescapeHtmlChars()` may (or may not) indicate an issue with how you're storing and transfering data. Escaping HTML characters is an operation that is generally done the moment before you insert it into your page. If this pattern is followed, you will generally have an unescaped version of your string on-hand as well, which removes the need for using an `unescapeHtmlChars()` function. [Further information about when to escape your HTML characters](https://security.stackexchange.com/questions/32394/when-to-escape-user-input/32396#32396).
