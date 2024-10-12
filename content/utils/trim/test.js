describe('trim()', () => {
  it('trims characters from both sides', () => {
    const res = $.trim(' \t\n abc  ');
    expect(res).toEqual('abc');
  });

  it('can trim down to an empty string', () => {
    const res = $.trim('  \n\t ');
    expect(res).toEqual('');
  });

  it("does not trim when there's nothing to trim", () => {
    const res = $.trim('abc');
    expect(res).toEqual('abc');
  });

  it('can use custom trim characters', () => {
    const res = $.trim('XYabcXYX', 'XY');
    expect(res).toEqual('abc');
  });

  it("won't trim anything if an empty string is provided for the trim characters", () => {
    const res = $.trim(' abc ', '');
    expect(res).toEqual(' abc ');
  });
});
