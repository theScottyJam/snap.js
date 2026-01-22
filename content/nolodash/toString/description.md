Simply using `String(value)` to convert an arbitrary value to a string should support a wide variety of you use-cases. If you have special needs, you can build up your own stringify function. The following example mimics Lodash's `_.toString()`'s behavior:

```javascript
function toString(value) {
  if (Object.is(value, -0)) {
    return '-0';
  }

  if (value == null) {
    return '';
  }

  return String(value);
}
```

One notable difference between the above and Lodash's implementation is that Lodash also adds special handling for arrays to make sure they preserve the negative sign on zeros when converting their contents into strings.

Of course, you can add or remove from the above example to better fit your own use-cases. For example, here is a more sophisticated function I have used in personal projects in the past, who's purpose was to convert invalid arguments into strings that could then be embedded into error messages. (This particular implementation is likely more complicated than what most projects would need).

```javascript
export function reprUnknownValue(value) {
  if (typeof value === 'function') {
    if (value.name === '') return '[anonymous function/class]';
    return '`' + value.name + '`';
  }

  if (typeof value === 'object' && value !== null) {
    const name = Object.getPrototypeOf(value)?.constructor?.name;
    if (typeof name === 'string') {
      return `[object ${name}]`;
    } else {
      return Object.prototype.toString.call(value);
    }
  }

  if (typeof value === 'string') {
    if (value.length > 55) {
      return JSON.stringify(value.slice(0, 50) + '…');
    } else {
      return JSON.stringify(value);
    }
  }
  if (typeof value === 'bigint') return String(value) + 'n';
  return String(value);
}
```

Or, you could consider stringifying objects (and perhaps truncating them if the string is too long), like this:

```javascript
export function toString(value) {
  if (typeof value !== 'object' || value === null) {
    return String(value);
  }

  let stringified;
  try {
    stringified = JSON.stringify(value);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return String(error);
    } else {
      throw error;
    }
  }

  if (stringified.length > 300) {
    return stringified.slice(0, 300) + '…';
  } else {
    return stringified;
  }
}
```
