describe('trimLeft()', () => {
  it('trims characters from the left', () => {
    const res = _.trimLeft(' \t\n abc  ');
    expect(res).toEqual('abc  ');
  });

  it('can trim down to an empty string', () => {
    const res = _.trimLeft('  \n\t ');
    expect(res).toEqual('');
  });

  it("does not trim when there's nothing to trim", () => {
    const res = _.trimLeft('abc ');
    expect(res).toEqual('abc ');
  });

  it('can use custom trim characters', () => {
    const res = _.trimLeft('YXabcXYX', 'XY');
    expect(res).toEqual('abcXYX');
  });

  it("won't trim anything if an empty string is provided for the trim characters", () => {
    const res = _.trimLeft(' abc ', '');
    expect(res).toEqual(' abc ');
  });
});
