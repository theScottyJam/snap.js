A basic implementation that does not support the `separator` parameter can be achieved as follows:

```javascript
function truncate(string, { length, omission = '...' }) {
  if (string.length <= length) {
    return string;
  }

  return string.slice(0, length - omission.length) + omission;
}
```

A more complete implementation that supports truncating at a string or regular expression separator can be implemented as follows:

```javascript
function truncate(string, { length, separator = '', omission = '...' }) {
  if (string.length <= length) {
    return string;
  }

  // Largest size you can slice `string` while remaining in the `length` restriction.
  const maxSliceLength = length - omission.length;

  if (typeof separator === 'string') {
    let index = string.lastIndexOf(separator, maxSliceLength);
    if (index === -1) {
      index = maxSliceLength;
    }
    return string.slice(0, index) + omission;
  } else if (separator instanceof RegExp) {
    let bestMatch = undefined;
    for (const match of string.matchAll(separator)) {
      if (match.index <= maxSliceLength) {
        bestMatch = match;
      }
    }

    const index = bestMatch?.index ?? maxSliceLength;
    return string.slice(0, index) + omission;
  } else {
    throw new Error('Invalid separator type received.');
  }
}
```

One difference with the above implementation and Lodash's version is that a separator regular expression must have the "g" flag set. If you have a regular expression on hand that does not have the `g` flag set, and you would like it to, you can convert it as follows:

```javascript
const regexWithGlobalFlag = regex.global
  ? regex
  : new RegExp(regex.source, regex.flags + 'g');
```

If you're wanting to truncate a string before displaying it in the browser, you may wish to instead use the `text-overflow: ellipsis` rule on the container holding to text. This rule is able to smartly truncate the text just before it would overflow out of the container, as opposed to truncating based on character count (remember that different characters can have different widths). To make the text-overflow property work, you'll also need to limit the container's size (e.g. by setting the `width` rule), set `overflow: hidden`, and set `white-space: nowrap`.
