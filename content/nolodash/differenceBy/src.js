function differenceBy(array, values = [], iteratee = x => x) {
  const transformedValues = new Set(values.map(x => iteratee(x)));
  return array.filter(x => !transformedValues.has(iteratee(x)));
}
