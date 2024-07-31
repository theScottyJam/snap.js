// <-- See if I can just target all headers everywhere instead of trying to remember to auto-inject this style in each CSS block.
export const headerStyleMixin = `
  h1, h2, h3, h4, h5 {
    font-family: 'Questrial', sans-serif;
    letter-spacing: 0.05em;
  }
`;