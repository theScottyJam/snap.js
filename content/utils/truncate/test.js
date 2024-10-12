describe('truncate()', () => {
  it('does not modify a string within the size limit', () => {
    const res = $.truncate('abcde', 5);
    expect(res).toBe('abcde');
  });

  it('truncates strings that are too large', () => {
    const res = $.truncate('abcdef', 5);
    expect(res).toBe('abcde…');
  });

  it('allows truncate indicator to be customized', () => {
    const res = $.truncate('abcdef', 5, { truncIndicator: '...' });
    expect(res).toBe('abcde...');
  });
});
