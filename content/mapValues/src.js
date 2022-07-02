function mapValues(obj, fn) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = fn(value);
  }
  return newObj;
}
