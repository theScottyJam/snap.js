describe('addToDate()', () => {
  it('should be able to add years to the date', () => {
    const oldDate = new Date(2000, 5, 3);
    const newDate = _.addToDate(oldDate, { years: 2 });
    expect(newDate.toString()).toBe(new Date(2002, 5, 3).toString());
  });

  it('should be able to add months to the date, and have it wrap to a new year', () => {
    const oldDate = new Date(2000, 10, 3);
    const newDate = _.addToDate(oldDate, { months: 3 });
    expect(newDate.toString()).toBe(new Date(2001, 1, 3).toString());
  });

  it('should be able to add days to the date, and have it wrap to a new year', () => {
    const oldDate = new Date(2000, 11, 29);
    const newDate = _.addToDate(oldDate, { days: 4 });
    expect(newDate.toString()).toBe(new Date(2001, 0, 2).toString());
  });

  it('should be able to add hours to the date, and have it wrap to a new year', () => {
    const oldDate = new Date(2000, 11, 31, 23);
    const newDate = _.addToDate(oldDate, { hours: 2 });
    expect(newDate.toString()).toBe(new Date(2001, 0, 1, 1).toString());
  });

  it('should be able to add minutes to the date, and have it wrap to a new year', () => {
    const oldDate = new Date(2000, 11, 31, 24, 59);
    const newDate = _.addToDate(oldDate, { minutes: 2 });
    expect(newDate.toString()).toBe(new Date(2001, 0, 1, 1, 1).toString());
  });

  it('should be able to add seconds to the date, and have it wrap to a new year', () => {
    const oldDate = new Date(2000, 11, 31, 24, 59, 59);
    const newDate = _.addToDate(oldDate, { seconds: 2 });
    expect(newDate.toString()).toBe(new Date(2001, 0, 1, 1, 0, 1).toString());
  });

  it('should be able to add milliseconds to the date, and have it wrap to a new year', () => {
    const oldDate = new Date(2000, 11, 31, 24, 59, 59, 999);
    const newDate = _.addToDate(oldDate, { ms: 2 });
    expect(newDate.toString()).toBe(new Date(2001, 0, 1, 1, 0, 0, 1).toString());
  });

  it('should be able to update all attributes at the same time.', () => {
    const oldDate = new Date(2000, 1, 2, 3, 4, 5, 6, 7);
    const newDate = _.addToDate(oldDate, { years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6, ms: 7 });
    expect(newDate.toString()).toBe(new Date(2001, 3, 5, 7, 9, 11, 13, 15).toString());
  });

  it('should support negative deltas', () => {
    const oldDate = new Date(2001, 3, 5, 7, 9, 11, 13, 15);
    const newDate = _.addToDate(oldDate, { years: -1, months: -2, days: -3, hours: -4, minutes: -5, seconds: -6, ms: -7 });
    expect(newDate.toString()).toBe(new Date(2000, 1, 2, 3, 4, 5, 6, 7).toString());
  });
});