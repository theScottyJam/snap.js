```javascript
function sortedUniqBy(array, iteratee) {
  if (array.length === 0) {
    return [];
  }

  let lastTransformedValue = iteratee(array[0]);
  const result = [array[0]];
  for (let i = 0; i < array.length; ++i) {
    const transformedValue = iteratee(array[i]);
    if (lastTransformedValue !== transformedValue) {
      result.push(array[i]);
      lastTransformedValue = transformedValue;
    }
  }

  return result;
}
```
