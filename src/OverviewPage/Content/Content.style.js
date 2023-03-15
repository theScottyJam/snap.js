import { css } from '@emotion/css';

let style = {};
export default style;

const FILTER_BOX_HEIGHT = 28;

style.content = css`
  label: content;
  margin: 50px auto 80px;
  width: 800px;
  position: relative;
  @media (max-width: 850px) {
    width: 90vw;
    margin-left: 5vw;
  }
`;

style.categoryName = css`
  label: category-name;
  margin-bottom: 28px;
  margin-top: 35px;
  font-size: 1.55rem;
  background: #333;
  color: #eee;
  padding: 4px 8px 3px;
  display: inline-block;
`;

style.filterBox = css`
  label: filter-box;
  display: flex;
  justify-content: center;
  margin-top: 55px;
  margin-bottom: 5px;
  font-size: 1rem;
`;

style.filterBoxInner = css`
  label: filter-box-inner;
  display: flex;
  flex-flow: row;
  padding: 4px;
  border: 1px solid black;
  &:focus-within {
    border: 2px solid #00a;
    padding: 3px;
  }
  @media (max-width: 400px) {
    flex: 1;
  }
`;

style.filterBoxInput = css`
  label: filter-box-input;
  height: ${FILTER_BOX_HEIGHT}px;
  font-size: 1rem;
  margin: 0;
  border: 0;
  outline: 0;
  width: 300px;
  @media (max-width: 400px) {
    width: unset;
    flex: 1;
  }
`;

style.filterBoxIcon = css`
  label: filter-box-icon;
  display: inline-block;
  width: ${FILTER_BOX_HEIGHT}px;
  height: ${FILTER_BOX_HEIGHT}px;
  margin-top: 1px;
`;

style.noResults = css`
  label: no-results;
  display: inline-block;
  margin-top: 1em;
  color: #444;
`;
