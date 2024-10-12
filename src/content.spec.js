const content = [
  ...require('../public/nolodashContent.json'),
  ...require('../public/utilsContent.json'),
];

for (const { categoryHeading, entries } of content) {
  for (const { src, test } of entries) {
    if (test === undefined) {
      continue;
    }
    // Evaluate the src code, returning the function contained inside.
    const srcFn = new Function(`return (${src ?? '() => {}'})`)(); // eslint-disable-line no-new-func
    // Creates a utility object to pass into the test case
    const $ = { [srcFn.name]: srcFn };
    // Executes the test cases
    new Function('$', 'jest', test)($, jest); // eslint-disable-line no-new-func
  }
}
