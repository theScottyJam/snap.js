function truncate(str, maxSize, { truncIndicator = '…' } = {}) {
  if (str.length <= maxSize) return str;
  return str.slice(0, maxSize) + truncIndicator;
}
