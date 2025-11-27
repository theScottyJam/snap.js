function trim(str, toRemove = ' \t\n') {
  const chars = str.split('');
  while (chars.length && toRemove.includes(chars[0])) chars.shift();
  while (chars.length && toRemove.includes(chars.at(-1))) chars.pop();
  return chars.join('');
}

describe('trim()', () => {
  it('trims characters from both sides', () => {
    const res = trim(' \t\n abc  ');
    expect(res).toEqual('abc');
  });

  it('can trim down to an empty string', () => {
    const res = trim('  \n\t ');
    expect(res).toEqual('');
  });

  it("does not trim when there's nothing to trim", () => {
    const res = trim('abc');
    expect(res).toEqual('abc');
  });

  it('can use custom trim characters', () => {
    const res = trim('XYabcXYX', 'XY');
    expect(res).toEqual('abc');
  });

  it("won't trim anything if an empty string is provided for the trim characters", () => {
    const res = trim(' abc ', '');
    expect(res).toEqual(' abc ');
  });
});
