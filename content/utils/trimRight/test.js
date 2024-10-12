describe('trimRight()', () => {
  it('trims characters from the right', () => {
    const res = $.trimRight(' \t\n abc  ');
    expect(res).toEqual(' \t\n abc');
  });

  it('can trim down to an empty string', () => {
    const res = $.trimRight('  \n\t ');
    expect(res).toEqual('');
  });

  it("does not trim when there's nothing to trim", () => {
    const res = $.trimRight(' abc');
    expect(res).toEqual(' abc');
  });

  it('can use custom trim characters', () => {
    const res = $.trimRight('YXabcXYX', 'XY');
    expect(res).toEqual('YXabc');
  });

  it("won't trim anything if an empty string is provided for the trim characters", () => {
    const res = $.trimRight(' abc ', '');
    expect(res).toEqual(' abc ');
  });
});
