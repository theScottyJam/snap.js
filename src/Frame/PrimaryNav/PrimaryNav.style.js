import { css } from '@emotion/css';

let style = {};
export default style;

style.primaryNav = css`
  label: primaryNav;
  padding-top: 12px;
  padding-left: 6px;
  padding-bottom: 12px;
  display: flex;
  @media screen and (max-width: 600px) {
    flex-flow: column;
    gap: 12px;
    background: #eee;
    text-align: center;
    box-shadow: 0 -10px 10px -10px rgba(0, 0, 0, 0.1) inset;
  }
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
  margin: 0px 6px;
  letter-spacing: 0.1em;
  font-weight: bold;

  cursor: default;
  color: #00302d;
  text-decoration: none;
  pointer-events: ${active ? 'none' : 'initial'};
  ${!active ? nonActiveLinkMixin : undefined}
`;
