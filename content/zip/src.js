function* zip(...iterables) {
  if (iterables.length === 0) return
  const iters = iterables.map(x => x[Symbol.iterator]())
  while (true) {
    const yieldedValues = iters.map(x => x.next())
    if (yieldedValues.some(x => x.done)) return
    yield yieldedValues.map(x => x.value)
  }
}