describe('clamp', () => {
  it('returns the min threshold when the value is too low', () => {
    const res = _.clamp(2, 3, 5)
    expect(res).toBe(3)
  })

  it('returns the max threshold when the value is too low', () => {
    const res = _.clamp(8, 3, 5)
    expect(res).toBe(5)
  })

  it('returns the value when its within the bounds', () => {
    const res = _.clamp(4, 3, 5)
    expect(res).toBe(4)
  })
})