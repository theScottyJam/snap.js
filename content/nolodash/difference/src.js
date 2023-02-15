// Instead of using Lodash's _.difference():
//   const result = _.difference(array1, array2)
// You can simply do this:

const result = array1.filter(x => !array2.includes(x));

// If you need to subtract multiple arrays, just merge them first. i.e. instead of this:
//   const result = _.difference(array1, array2, array3)
// You can simply do this:

const result = array1.filter(x => ![...array2, ...array3].includes(x));
