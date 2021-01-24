const content = require('../public/content.json')

for (const {categoryHeading, entries} of content) {
  for (const {src, test} of entries) {
    // Evaluate the src code, returning the function contained inside.
    const srcFn = new Function(`return (${src})`)()
    // Creates a utility object to pass into the test case
    const _ = { [srcFn.name]: srcFn }
    // Executes the test cases
    new Function('_', 'jest', test)(_, jest)
  }
}
