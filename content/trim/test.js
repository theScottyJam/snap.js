describe('trim()', () => {
  it('trims characters from both sides', () => {
    const res = _.trim(' \t\n abc  ')
    expect(res).toEqual('abc')
  })

  it('can trim down to an empty string', () => {
    const res = _.trim('  \n\t ')
    expect(res).toEqual('')
  })

  it("does not trim when there's nothing to trim", () => {
    const res = _.trim('abc')
    expect(res).toEqual('abc')
  })

  it('can use custom trim characters', () => {
    const res = _.trim('XYabcXYX', 'XY')
    expect(res).toEqual('abc')
  })

  it("won't trim anything if an empty string is provided for the trim characters", () => {
    const res = _.trim(' abc ', '')
    expect(res).toEqual(' abc ')
  })
})