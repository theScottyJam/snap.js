import { css } from '@emotion/css';

let style = {};
export default style;

style.primaryNav = css`
  label: primaryNav;
  margin-left: 12px;
`;

const nonActiveLinkMixin = css`
  cursor: pointer;
  color: black;
  text-decoration: underline;
`;

style.link = ({ active }) => css`
  label: link;
  display: inline-block;
  border: none;
  background: none;
  font-size: 0.9rem;
  padding: 1px 6px;
  margin: 12px 12px;
  letter-spacing: 0.1em;
  font-weight: bold;

  cursor: default;
  color: #00302d;
  text-decoration: none;
  pointer-events: ${active ? 'none' : 'initial'};
  ${!active ? nonActiveLinkMixin : undefined}
`;
