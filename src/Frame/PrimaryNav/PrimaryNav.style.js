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
  border: none;
  background: none;
  font-size: 0.9rem;
  margin: 12px 12px;
  letter-spacing: 0.07em;
  font-weight: bold;

  cursor: default;
  color: #00302d;
  text-decoration: none;
  ${!active ? nonActiveLinkMixin : undefined}
`;
