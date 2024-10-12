describe('mapValues()', () => {
  it('maps values in objects', () => {
    const oldObj = { a: 2, b: 3 };
    const newObj = $.mapValues(oldObj, x => x + 1);
    expect(newObj).toEqual({ a: 3, b: 4 });
  });

  it('only maps own (non-inherited) values', () => {
    class MyClass {
      x = 2;
      f() {}
    }

    const oldObj = new MyClass();
    const newObj = $.mapValues(oldObj, x => x + 1);
    expect(newObj).toEqual({ x: 3 });
  });
});
