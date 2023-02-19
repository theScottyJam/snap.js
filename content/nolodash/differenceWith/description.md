```javascript
function differenceWith(array, values, comparator) {
  return array.filter(x => !values.some(y => comparator(x, y)));
}
```
