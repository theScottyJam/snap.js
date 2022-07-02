import {css} from '@emotion/css'

let style = {}
export default style

style.frame = css`
  label: frame;
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`

style.childrenContainer = css`
  label: children-container;
  flex: 1;
`