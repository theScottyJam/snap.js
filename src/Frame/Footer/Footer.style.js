import { css } from '@emotion/css';

let style = {};
export default style;

style.footer = css`
  label: footer;
  // display: flex;
  // justify-content: flex-end;
  width: 100%;
  background: #325d56;
  box-shadow: 0 15px 15px -15px rgba(0, 0, 0, 0.25) inset;
`;

style.footerText = css`
  label: footer-text;
  // flex: none;
  font-size: 0.75rem;
  margin: 0;
  margin-right: 8px;
  padding: 6px 8px;
  text-align: right;
  line-height: 1.4em;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.95);
  & a {
    color: inherit;
  }
  @media (max-width: 750px) {
    text-align: left;
  }
`;

style.breakWhenSmall = css`
  label: break-when-small;
  display: none;
  @media (max-width: 750px) {
    display: unset;
  }
`;
