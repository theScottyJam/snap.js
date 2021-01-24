import {css} from '@emotion/css'

let style = {}
export default style

style.header = css`
  label: header;
  width: 100%;
  height: 160px;
  background: radial-gradient(circle, rgba(0,140,140,1) 0%, rgba(0,106,89,1) 100%);
  color: white;
  position: relative; // Makes overflow work properly
  overflow: hidden;
  box-shadow: 0 -15px 15px -15px rgba(0,0,0,0.15) inset;
`

style.logo = css`
  label: logo;
  display: block;
  margin: 0 auto;
  margin-top: 18px;
  position: relative; // Puts it in front of background decor
`

style.subheading = css`
  label: sub-heading;
  font-size: 1rem;
  text-align: center;
  margin: 0;
  margin-top: 7px;
  letter-spacing: 1.7px;
  color: rgba(150, 220, 255, 1);
  position: relative; // Puts it in front of background decor
`