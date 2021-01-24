function* iterWithPeeking(iterable) {
  let iteratorFinished = false
  const upcomming = []

  const iter = iterable[Symbol.iterator]()
  const preloadUpcomming = ({quantityDesired}) => {
    while (!iteratorFinished && upcomming.length <= quantityDesired) {
      const {value, done} = iter.next()
      if (!done) upcomming.push(value)
      iteratorFinished = done
    }
    return { success: upcomming.length >= quantityDesired }
  }

  const peek = (amount = 1) => {
    if (amount === 0) throw new Error(`Unsupported index: ${amount}`)
    const { success } = preloadUpcomming({quantityDesired: amount - 1})
    return success ? upcomming[amount - 1] : undefined
  }

  while (true) {
    const {success} = preloadUpcomming({quantityDesired: 1})
    if (!success) break
    yield [upcomming.shift(), peek]
  }
}