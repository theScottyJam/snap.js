function unescapeHtmlChars(string) {
  // Unecoding "&" needs to be done last.
  // If it is done first, something like "&amp;lt;" would incorrectly
  // get unencoded to "<", when it should be "&lt;"
  return string
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&');
}

describe('unescape()', () => {
  it('unescapes all characters', () => {
    const res = unescapeHtmlChars('&amp;&lt;&gt;&quot;&#39;');
    expect(res).toEqual('&<>"\'');
  });

  it('unescapes all instances', () => {
    const res = unescapeHtmlChars('&amp;&lt;&amp;&lt;&amp;');
    expect(res).toEqual('&<&<&');
  });

  it("doesn't panic on the empty string", () => {
    expect(unescapeHtmlChars('')).toEqual('');
  });

  it('does not double-unescape characters', () => {
    const res = unescapeHtmlChars('&amp;lt;');
    // Should equal "&lt;", not "<"
    expect(res).toEqual('&lt;');
  });
});
