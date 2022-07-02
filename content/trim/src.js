function trim(str, toRemove = ' \t\n') {
  const chars = str.split('');
  while (chars.length && toRemove.includes(chars[0])) chars.shift();
  while (chars.length && toRemove.includes(chars.at(-1))) chars.pop();
  return chars.join('');
}
