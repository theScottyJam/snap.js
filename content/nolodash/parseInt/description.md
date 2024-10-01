```javascript
parseInt(string, radix)
```

Be aware that `parseInt()` may exhibit some surprising and undesirable behaviors, for example, if it's unable to parse a portion of a string, it'll discard the rest and parse what it can, leading to strings such as `parseInt('2e7')` resulting in `2` being returned.

For a larger discussion on string-to-number conversion, see [the doc entry for `_.toNumber()`](#!/nolodash/toNumber).
