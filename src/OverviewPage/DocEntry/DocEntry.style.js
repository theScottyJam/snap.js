import { css } from '@emotion/css';

let style = {};
export default style;

style.docEntry = css`
  label: doc-entry;
`;

style.fnSignature = css`
  label: fn-signature;
  color: #027;
  background: #ddd;
  padding: 2px 4px;
  cursor: pointer;
  font-size: 0.9rem;
`;

style.summary = css`
  label: summary;
  margin: 7px 0 20px 20px;
  font-size: 0.9rem;
  line-height: 1.5em;
  & code {
    background: #ddd;
    padding: 0 2px;
  }
  & * {
    margin-top: 0;
    margin-bottom: 0;
  }
`;
