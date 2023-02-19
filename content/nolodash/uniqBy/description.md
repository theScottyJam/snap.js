```javascript
function uniqBy(array, iteratee) {
  const transformedResults = new Set();
  const result = [];
  for (const element of array) {
    const transformedElement = iteratee(element);
    if (!transformedResults.has(transformedElement)) {
      transformedResults.add(transformedElement);
      result.push(element);
    }
  }

  return result;
}
```
