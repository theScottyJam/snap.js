describe('zip()', () => {
  const range = function*(start, stop) {
    for (let i = start; i < stop; ++i) yield i
  }

  it('zips up iterables', () => {
    const zipped = [..._.zip(range(0, 3), range(3, 6))]
    expect(zipped).toEqual([[0,3], [1,4], [2,5]])
  })

  it('discards elements from longer iterables', () => {
    const zipped = [..._.zip(range(0, 3), range(3, 9))]
    expect(zipped).toEqual([[0,3], [1,4], [2,5]])
  })

  it('zips up three iterables', () => {
    const zipped = [..._.zip([1,4], [2,5], [3,6])]
    expect(zipped).toEqual([[1,2,3], [4,5,6]])
  })

  it('zips up a single itierable', () => {
    const zipped = [..._.zip([1, 2, 3])]
    expect(zipped).toEqual([[1], [2], [3]])
  })

  it('zips up no iterables', () => {
    const zipped = [..._.zip()]
    expect(zipped).toEqual([])
  })

  it('zips up empty iterables', () => {
    const zipped = [..._.zip([], [])]
    expect(zipped).toEqual([])
  })
})