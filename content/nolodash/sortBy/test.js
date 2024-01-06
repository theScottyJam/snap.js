describe('sortBy() supporting only one iteratee', () => {
  function sortBy(collection, iteratee) {
    return collection.sort((value1, value2) => {
      const comparable1 = iteratee(value1);
      const comparable2 = iteratee(value2);
      if (comparable1 < comparable2) return -1;
      if (comparable1 > comparable2) return 1;
      return 0;
    });
  }

  it('sorts using the iteratee function', () => {
    const users = [
      { user: 'fred', age: 48 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 34 },
    ];

    const result = sortBy(users, o => o.user);

    expect(result).toEqual([
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
    ]);
  });
});

describe('sortBy() supporting multiple iteratees', () => {
  function sortBy(collection, iteratees) {
    return collection.sort((value1, value2) => {
      for (const iteratee of iteratees) {
        const comparable1 = iteratee(value1);
        const comparable2 = iteratee(value2);
        if (comparable1 < comparable2) return -1;
        if (comparable1 > comparable2) return 1;
      }
      return 0;
    });
  }

  it('sorts using the iteratee functions', () => {
    const users = [
      { user: 'fred', age: 48 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 34 },
    ];

    const result = sortBy(users, [o => o.user, o => o.age]);

    expect(result).toEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'fred', age: 48 },
    ]);
  });
});
