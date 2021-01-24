function* enumerate(iterable) {
  let i = 0
  for (const element of iterable) {
    yield [i++, element]
  }
}