describe('unescape()', () => {
  it('unescapes all characters', () => {
    const res = _.unescape('&amp;&lt;&gt;&quot;&#39;');
    expect(res).toEqual('&<>"\'');
  });

  it('unescapes all instances', () => {
    const res = _.unescape('&amp;&lt;&amp;&lt;&amp;');
    expect(res).toEqual('&<&<&');
  });

  it("doesn't panic on edge cases", () => {
    // empty
    expect(_.unescape('')).toEqual('');
    // undefined
    expect(_.unescape()).toEqual('undefined');
    // null
    expect(_.unescape(null)).toEqual('null');
    // Number
    expect(_.unescape(10)).toEqual('10');
    // Array
    expect(_.unescape(['hello', 'world'])).toEqual('hello,world');
    // Object
    expect(_.unescape({ obj: true })).toEqual('[object Object]');
  });
});
