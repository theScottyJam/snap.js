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
  text-decoration: unset;
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

style.unlisted = css`
  label: unlisted;
  display: flex;
  flex-flow: column;
  gap: 1rem;
  background: #fcd;
  border: #f00;
  border-radius: 6px;
  padding: 12px;
  & > * {
    margin: 0;
  }
`;
