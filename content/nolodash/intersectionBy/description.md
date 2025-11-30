```javascript
function intersectionBy(array1, array2, iteratee = x => x) {
  const result = [];
  const resultTransformed = new Set();
  const array2Transformed = new Set(array2.map(x => iteratee(x)));
  for (const element of array1) {
    const transformedElement = iteratee(element);
    const isInIntersection = (
      !resultTransformed.has(transformedElement) &&
      array2Transformed.has(transformedElement)
    );

    if (isInIntersection) {
      result.push(element);
      resultTransformed.add(transformedElement);
    }
  }

  return result;
}
```

If you know that `array1` doesn't contain duplicate elements, or you don't care if duplicate elements from `array1` end up in the final result, then this implementation will achieve the same effect:

```javascript
function intersectionBy(array1, array2, iteratee = x => x) {
  const array2Transformed = new Set(array2.map(x => iteratee(x)));
  return array1.filter(x => array2Transformed.has(iteratee(x)));
}
```
