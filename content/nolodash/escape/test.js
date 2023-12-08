function escapeHtmlChars(string) {
  return string
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

describe('escapeHtmlChars()', () => {
  it('escapes all characters', () => {
    const res = escapeHtmlChars('&<>"\'');
    expect(res).toEqual('&amp;&lt;&gt;&quot;&#39;');
  });

  it('escapes all instances', () => {
    const res = escapeHtmlChars('&<&<&');
    expect(res).toEqual('&amp;&lt;&amp;&lt;&amp;');
  });

  it("doesn't panic on the empty string", () => {
    expect(escapeHtmlChars('')).toEqual('');
  });
});
