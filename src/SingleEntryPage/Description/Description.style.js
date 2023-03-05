import { css } from '@emotion/css';

let style = {};
export default style;

style.description = css`
  label: description;
  font-size: 0.9rem;
  line-height: 1.5em;
  & h1 {
    line-height: 1.1em;
    @media (max-width: 400px) {
      font-size: 1.6rem;
    }
  }
`;

style.inlineCode = css`
  label: inline-code;
  background: #ddd;
  padding: 0 2px;
`;
