// Instead of using Lodash's _.compact():
//   const result = _.compact(array)
// You can simply do this:

const result = array.filter(value => !!value);
