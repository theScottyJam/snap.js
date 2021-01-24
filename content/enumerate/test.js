describe('enumerate()', () => {
  const range = function*(start, stop) {
    for (let i = start; i < stop; ++i) yield i
  }

  it('enumerates an iterable', () => {
    const enumerated = [..._.enumerate(range(5, 8))]
    expect(enumerated).toEqual([[0,5], [1,6], [2,7]])
  })

  it('works on an empty iterable', () => {
    const enumerated = [..._.enumerate([])]
    expect(enumerated).toEqual([])
  })
})