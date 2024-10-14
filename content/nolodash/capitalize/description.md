```javascript
function capitalize([first='', ...rest]) {
  return first.toUpperCase() + rest.join('').toLowerCase();
}
```

If you need better unicode support and an internationalization-friendly capitalize implementation, use the following instead instead:

```javascript
// Set this to your preferred locale,
// or set it to `undefined` to use the runtime's default locale.
const LOCALE = 'en';
const segmenter = new Intl.Segmenter(LOCALE);

function capitalize(text) {
  let result = '';
  for (const { segment, index } of segmenter.segment(text)) {
    if (index === 0) {
      result += segment.toLocaleUpperCase(LOCALE);
    } else {
      result += segment.toLocaleLowerCase(LOCALE);
    }
  }

  return result;
}
```
