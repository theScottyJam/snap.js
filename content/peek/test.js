describe('peek()', () => {
  it('gets the last element of an array', () => {
    expect(_.peek(['a', 'b', 'c'])).toBe('c')
  })

  it('returned undefined on an empty array', () => {
    expect(_.peek([])).toBeUndefined()
  })
})