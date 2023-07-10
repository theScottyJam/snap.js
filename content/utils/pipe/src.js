function pipe(value, ...fns) {
  for (const fn of fns) {
    value = fn(value);
  }
  return value;
}
