import { css } from '@emotion/css';

let style = {};
export default style;

style.square1 = css`
  label: square1-decor;
  position: absolute;
  width: 75px;
  height: 75px;
  right: 170px;
  top: 30px;
  transform: rotate(25deg);
  background: rgb(0, 135, 135);
  @media (max-width: 600px) {
    top: 25px;
    right: 25px;
  }
`;

style.square2 = css`
  label: square2-decor;
  position: absolute;
  width: 35px;
  height: 35px;
  right: 120px;
  top: 80px;
  transform: rotate(-37deg);
  background: rgb(0, 135, 135);
  @media (max-width: 600px) {
    top: 110px;
    right: 70px;
  }
`;

// Gradient adapted from https://projects.verou.me/css3patterns/#polka-dot
style.dotted = css`
  label: dotted-decor;
  position: absolute;
  width: 250px;
  height: 250px;
  right: -50px;
  top: -50px;
  transform: rotate(35deg);
  background-image: radial-gradient(rgba(0, 0, 0, 0.4) 10%, transparent 16%);
  background-size: 15px 15px;
  @media (max-width: 600px) {
    display: none;
  }
`;

// Gradient adapted from https://projects.verou.me/css3patterns/#waves
style.squiggle = css`
  label: squiggle-decor;
  position: absolute;
  width: 120px;
  height: 120%;
  left: 80px;
  top: -12px;
  background: radial-gradient(
        circle at 100% 50%,
        transparent 18%,
        rgba(150, 255, 255, 0.15) 19%,
        rgba(150, 255, 255, 0.15) 36%,
        transparent 37%,
        transparent
      )
      30px 0,
    radial-gradient(
        circle at 0% 50%,
        transparent 18%,
        rgba(150, 255, 255, 0.15) 19%,
        rgba(150, 255, 255, 0.15) 36%,
        transparent 37%,
        transparent
      )
      30px -40px;
  background-color: transparent;
  background-size: 60px 80px;
  transform: rotate(-15deg);
  @media (max-width: 600px) {
    left: -15px;
  }
`;

// Gradient adapted from https://projects.verou.me/css3patterns/#polka-dot
style.dottedLine = css`
  label: dotted-line-decor;
  position: absolute;
  width: 35%;
  height: 50px;
  left: 0;
  top: 10px;
  background-image: radial-gradient(rgba(0, 137, 137, 1) 8%, transparent 10%);
  background-size: 30px 40px;
  background-position: 0 0, 10px 10px;
  @media (max-width: 600px) {
    display: none;
  }
`;
