describe('upperCase()', () => {
  function upperCase(string) {
    const words = string.split(/\s+/);
    return words.map(word => word.toUpperCase()).join(' ');
  }

  it('converts the words from the supplied string into upper-case', () => {
    expect(upperCase('HELLO    aWeSoMe\nworld')).toEqual('HELLO AWESOME WORLD');
  });

  it('handles an empty string', () => {
    expect(upperCase('')).toEqual('');
  });
});
