```javascript
function uniqWith(array, comparator) {
  const result = [];
  for (const element of array) {
    if (result.every(x => !comparator(x, element))) {
      result.push(element);
    }
  }

  return result;
}
```
