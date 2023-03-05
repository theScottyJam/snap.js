import { css } from '@emotion/css';

let style = {};
export default style;

style.backButton = css`
  label: back-button;
  background: #ccc;
  color: #111;
  border: none;
  padding: 5px 10px;
  font-size: 1rem;
  cursor: pointer;
`;

style.entryHeader = css`
  label: entry-header;
  fontsize: 1.7rem;
  fontfamily: 'Roboto Mono', monospace;
  @media (max-width: 400px) {
    font-size: 1.6rem;
  }
`;

style.fnSignatureLink = css`
  label: fn-signature-link;
  color: #222;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
