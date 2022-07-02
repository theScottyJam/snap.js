import { css } from '@emotion/css';

let style = {};
export default style;

const left = 40;

style.popup = transitionPhaseName => css`
  label: popup;
  padding-left: 50px;
  position: fixed;
  top: 0;
  left: ${left}%;
  width: ${100 - left}%;
  height: 100%;
  background: white;
  z-index: 100;
  overflow: auto;
  box-sizing: border-box;
  box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.2);
  transition: opacity 175ms ease-out, transform 175ms ease-out;
  ${{
    initEntering: css`
      opacity: 0;
      transform: translateX(40px);
    `,
    entering: css`
      opacity: 1;
      transform: translateX(0px);
    `,
    entered: css`
      opacity: 1;
      transform: unset;
    `,
    exiting: css`
      opacity: 0;
      transform: translateX(40px);
    `,
    exited: css`
      display: none;
    `,
  }[transitionPhaseName]}
`;

style.popupInner = css`
  label: popup-inner;
  width: calc(${100 - left}vw - 100px);
  padding-top: 40px;
  padding-bottom: 30px;
`;

style.popupBackdrop = transitionPhaseName => css`
  label: popup-backdrop;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 50;
  transition: opacity 250ms ease-out;
  ${{
    initEntering: css`
      opacity: 0;
    `,
    entering: css`
      opacity: 1;
    `,
    entered: css`
      opacity: 1;
    `,
    exiting: css`
      opacity: 0;
    `,
    exited: css`
      display: none;
    `,
  }[transitionPhaseName]}
`;
