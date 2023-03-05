import { css } from '@emotion/css';

let style = {};
export default style;

const left = {
  forNormalDevices: 40,
  forSmallerDevices: 10,
  forReallySmallDevices: 2,
};

const padding = {
  forNormalDevices: 50,
  forSmallerDevices: 20,
  forReallySmallDevices: 15,
};

const deviceSize = {
  forSmallerDevices: 1000,
  forReallySmallDevices: 400,
};

style.popup = transitionPhaseName => css`
  label: popup;
  padding-left: ${padding.forNormalDevices}px;
  position: fixed;
  top: 0;
  left: ${left.forNormalDevices}%;
  width: ${100 - left.forNormalDevices}%;
  height: 100%;
  background: white;
  z-index: 100;
  overflow: auto;
  box-sizing: border-box;
  box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.2);
  transition: opacity 175ms ease-out, transform 175ms ease-out;
  @media (max-width: ${deviceSize.forSmallerDevices}px) {
    padding-left: ${padding.forSmallerDevices}px;
    left: ${left.forSmallerDevices}%;
    width: ${100 - left.forSmallerDevices}%;
  }
  @media (max-width: ${deviceSize.forReallySmallDevices}px) {
    padding-left: ${padding.forReallySmallDevices}px;
    left: ${left.forReallySmallDevices}%;
    width: ${100 - left.forReallySmallDevices}%;
  }
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
  // width: calc(${100 - left.forNormalDevices});
  width: calc(
    ${100 - left.forNormalDevices}vw - ${padding.forNormalDevices * 2}px
  );
  padding-top: 40px;
  padding-bottom: 30px;
  @media (max-width: ${deviceSize.forSmallerDevices}px) {
    width: calc(
      ${100 - left.forSmallerDevices}vw - ${padding.forSmallerDevices * 2}px
    );
  }
  @media (max-width: ${deviceSize.forReallySmallDevices}px) {
    width: calc(
      ${100 - left.forReallySmallDevices}vw -
        ${padding.forReallySmallDevices * 2}px
    );
  }
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
