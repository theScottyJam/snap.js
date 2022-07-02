import {css} from '@emotion/css'

let style = {}
export default style

style.footer = css`
  label: footer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 26px;
  background: #325d56;
  box-shadow: 0 15px 15px -15px rgba(0,0,0,0.25) inset;
`

style.footerText = css`
  label: footer-text;
  flex: none;
  font-size: 0.75rem;
  margin: 0;
  margin-right: 8px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.95);
  & a {
    color: inherit;
  }
`