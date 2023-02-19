```javascript
function sortedUniq(array) {
  if (array.length === 0) {
    return [];
  }

  const result = [array[0]];
  for (const value of array) {
    if (result[result.length - 1] !== value) {
      result.push(value);
    }
  }

  return result;
}
```

[Some basic benchmarks](https://gist.github.com/theScottyJam/8424183e49f4555b60752b21f1076129) shows that performance improves as the number of repeated items increase. If you're not dealing with large arrays, or arrays with many repeated items, then using the simpler `[...new Set(array)]` solution should be sufficient.
