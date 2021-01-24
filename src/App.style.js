import {css} from '@emotion/css'

let style = {}
export default style

const left = 40;

style.popup = css`
  label: popup;
  padding-left: 50px;
  position: fixed;
  top: 0;
  left: ${left}vw;
  width: ${100 - left}vw;
  height: 100%;
  background: white;
  z-index: 100;
  overflow: auto;
  box-shadow: 0 0 7px 2px rgba(0,0,0, 0.2);
`

style.popupInner = css`
  label: popup-inner;
  width: calc(${100 - left}vw - 100px);
  padding-top: 40px;
  padding-bottom: 30px;
`

style.outsidePopup = css`
  label: outside-popup;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0, 0.3);
  z-index: 50;
`