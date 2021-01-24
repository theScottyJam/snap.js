describe('assert()', () => {
  it('does nothing when the condition is true', () => {
    expect(() => _.assert(true)).not.toThrow()
  })

  it('throws a message when a condition is false', () => {
    expect(() => _.assert(false, 'message')).toThrowError('message')
  })
})