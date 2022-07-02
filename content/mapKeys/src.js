function mapKeys(obj, fn) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[fn(key)] = value;
  }
  return newObj;
}
