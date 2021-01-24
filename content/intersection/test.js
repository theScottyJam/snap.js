describe('intersection()', () => {
  it('finds common elements in the arrays', () => {
    expect(_.intersection(['a', 'b', 'c'], ['b', 'c', 'd'])).toEqual(['b', 'c'])
  })

  it('returns an empty array when no common elements exist', () => {
    expect(_.intersection(['x'], ['y'])).toEqual([])
  })

  it('returns an empty array when input arrays are empty', () => {
    expect(_.intersection([], [])).toEqual([])
  })
})