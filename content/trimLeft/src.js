function trimLeft(str, toRemove=' \t\n') {
  const leftBound = str.split('').findIndex(c => !toRemove.includes(c))
  return leftBound === -1 ? '' : str.slice(leftBound)
}