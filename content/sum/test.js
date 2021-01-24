describe('sum', () => {
  it('can sum an iterable', () => {
    function* genValues() {
      yield 2
      yield 3
      yield 4
    }

    const total = _.sum(genValues())
    expect(total).toBe(9)
  })

  it('returns 0 when an empty iterable is provided', () => {
    expect(_.sum([])).toBe(0)
  })
})