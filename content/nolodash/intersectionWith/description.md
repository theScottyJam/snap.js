```javascript
function intersectionWith(array1, array2, comparator) {
  const result = [];
  for (const element of array1) {
    const isInIntersection = (
      !result.some(x => comparator(x, element)) &&
      array2.some(x => comparator(x, element))
    );

    if (isInIntersection) {
      result.push(element);
    }
  }

  return result;
}
```

If you know that `array1` doesn't contain duplicate elements, or you don't care if duplicate elements from `array1` end up in the final result, then this implementation will achieve the same effect:

```javascript
function intersectionWith(array1, array2, comparator) {
  return array1.filter(x => array2.some(y => comparator(x, y)));
}
```
