function el(tagName, attrs = {}, children = []) {
  const newElement = document.createElement(tagName);
  for (const [key, value] of Object.entries(attrs)) {
    newElement.setAttribute(key, value);
  }
  newElement.append(...children);
  return newElement;
}
