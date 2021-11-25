function fragment(children = []) {
  const newFragment = new DocumentFragment()
  newFragment.append(...children)
  return newFragment
}
