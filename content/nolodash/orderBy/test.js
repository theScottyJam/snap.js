function orderBy(collection, iteratees, orders) {
  return collection.sort((value1, value2) => {
    for (const [i, iteratee] of iteratees.entries()) {
      const reverseSortOrder = orders[i] === 'desc';
      const comparable1 = iteratee(value1);
      const comparable2 = iteratee(value2);
      if (comparable1 < comparable2) return reverseSortOrder ? 1 : -1;
      if (comparable1 > comparable2) return reverseSortOrder ? -1 : 1;
    }
    return 0;
  });
}

describe('orderBy()', () => {
  it('sorts using the iteratee functions and order instructions', () => {
    const users = [
      { user: 'fred', age: 48 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 34 },
    ];

    const result = orderBy(users, [o => o.user, o => o.age], ['asc', 'desc']);

    expect(result).toEqual([
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
    ]);
  });
});
