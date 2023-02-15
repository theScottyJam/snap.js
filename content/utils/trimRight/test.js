describe('trimRight()', () => {
  it('trims characters from the right', () => {
    const res = _.trimRight(' \t\n abc  ');
    expect(res).toEqual(' \t\n abc');
  });

  it('can trim down to an empty string', () => {
    const res = _.trimRight('  \n\t ');
    expect(res).toEqual('');
  });

  it("does not trim when there's nothing to trim", () => {
    const res = _.trimRight(' abc');
    expect(res).toEqual(' abc');
  });

  it('can use custom trim characters', () => {
    const res = _.trimRight('YXabcXYX', 'XY');
    expect(res).toEqual('YXabc');
  });

  it("won't trim anything if an empty string is provided for the trim characters", () => {
    const res = _.trimRight(' abc ', '');
    expect(res).toEqual(' abc ');
  });
});
