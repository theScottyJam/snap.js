function fragment(...children) {
  const newFragment = new DocumentFragment();
  newFragment.append(...children.flat());
  return newFragment;
}
