function* zip(...arrays) {
  if (arrays.length === 0) return;
  const minLength = Math.min(...arrays.map(arr => arr.length));
  for (let i = 0; i < minLength; ++i) {
    yield arrays.map(arr => arr[i]);
  }
}
