describe('escape()', () => {
  it('escapes all characters', () => {
    const res = _.escape('&<>"\'');
    expect(res).toEqual('&amp;&lt;&gt;&quot;&#39;');
  });

  it('escapes all instances', () => {
    const res = _.escape('&<&<&');
    expect(res).toEqual('&amp;&lt;&amp;&lt;&amp;');
  });

  it("doesn't panic on edge cases", () => {
    // empty
    expect(_.escape('')).toEqual('');
    // undefined
    expect(_.escape()).toEqual('undefined');
    // null
    expect(_.escape(null)).toEqual('null');
    // Number
    expect(_.escape(10)).toEqual('10');
    // Array
    expect(_.escape(['hello', 'world'])).toEqual('hello,world');
    // Object
    expect(_.escape({ obj: true })).toEqual('[object Object]');
  });
});
