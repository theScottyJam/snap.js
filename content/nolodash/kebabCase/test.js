describe('snakeCase()', () => {
  function snakeCase(string) {
    const words = string.split(/\s+/);
    return words.map(word => word.toLowerCase()).join(' ');
  }

  it('converts the words from the supplied string into lower-case', () => {
    expect(snakeCase('HELLO    aWeSoMe\nworld')).toEqual('hello awesome world');
  });

  it('handles an empty string', () => {
    expect(snakeCase('')).toEqual('');
  });
});
