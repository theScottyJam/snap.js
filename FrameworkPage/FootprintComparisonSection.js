/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-template-curly-in-string */

import { isMobileScreenSize$, MOBILE_SCREEN_SIZE, PUBLIC_URL } from './shared.js';
import { headerStyleMixin, ICON_BUTTON_BACKGROUND_ON_HOVER, ICON_BUTTON_OUTLINE_ON_FOCUS } from './sharedStyles.js';
import { defineElement, html, renderChoice, set, Signal, useSignals, withLifecycle } from './snapFramework.js';

const randomInt = max => Math.floor(Math.random() * max);

export const FootprintComparisonSection = defineElement('FootprintComparisonSection', () => {
  const currentComparison$ = new Signal(randomInt(comparisons.length));
  const previousComparison = () => {
    const newIndex = currentComparison$.get() - 1;
    currentComparison$.set(newIndex < 0 ? comparisons.length - 1 : newIndex);
  };
  const nextComparison = () => {
    const newIndex = currentComparison$.get() + 1;
    currentComparison$.set(newIndex >= comparisons.length ? 0 : newIndex);
  };
  return html`
    <div class="file-size-comparison-region">
      ${renderSwitchComparisonButton({
        direction: 'left',
        onClick: () => { throw new Error('unreachable - it should not be possible to click this.') },
        displayBehavior$: useSignals([isMobileScreenSize$], isMobileScreenSize => {
          return isMobileScreenSize ? 'not-rendered' : 'transparent'
        }),
      })}
      <!--
      The exact measurement I got when I last checked after minifying
      with minify-js.com and gzipping it with the "gzip" CLI tool was 1391 bytes.
      -->
      ${renderComparisonSquare('Snap Framework', 'Less than 1,400 bytes', 'minified + compressed', {
        iconUrl: `${PUBLIC_URL}/assets/file.svg`,
        iconAlt: 'Icon representing the framework',
        iconSize: 'slightly-larger',
        isForSnapFramework: true,
      })}
      <p class="vs">VS.</p>
      <div class="comparison-and-mobile-next-button">
        ${renderSwitchComparisonButton({
          direction: 'left',
          onClick: previousComparison,
          displayBehavior$: useSignals([isMobileScreenSize$], isMobileScreenSize => {
            return isMobileScreenSize ? 'visible' : 'not-rendered'
          }),
        })}
        ${renderChoice(
          comparisons.map((renderComparison, i) => ({
            signalWhen: useSignals([currentComparison$], currentComparison => currentComparison === i),
            render: renderComparison,
          }))
        )}
        ${renderSwitchComparisonButton({
          direction: 'right',
          onClick: nextComparison,
          displayBehavior$: useSignals([isMobileScreenSize$], isMobileScreenSize => {
            return isMobileScreenSize ? 'visible' : 'not-rendered'
          }),
        })}
      </div>
      ${renderSwitchComparisonButton({
        direction: 'right',
        onClick: nextComparison,
        displayBehavior$: useSignals([isMobileScreenSize$], isMobileScreenSize => {
          return isMobileScreenSize ? 'not-rendered' : 'visible'
        }),
      })}
    </div>

    <style ${set({ textContent: style })}></style>
  `;
});

/**
 * displayBehavior$ can either be set to "not-rendered", "transparent", or "visible"
 * * "not-rendered" - the same as "display: none"
 * * "transparent" - it can't be seen, it's only there to take up space, to help space things apart correctly
 * * "visible" - normal rendering
 */
function renderSwitchComparisonButton({ onClick, direction, displayBehavior$ }) {
  if (!['left', 'right'].includes(direction)) {
    throw new Error();
  }

  return html`
    <button title="Next Comparison" ${set({
      className: useSignals([displayBehavior$], displayBehavior => {
        const classes = ['switch-comparison', direction];
        if (displayBehavior === 'transparent') {
          classes.push('transparent')
        } else if (displayBehavior === 'not-rendered') {
          classes.push('not-rendered');
        } else if (displayBehavior !== 'visible') {
          throw new Error();
        }
        return classes.join(' ');
      }),
      onclick: onClick,
    })}>
      <img ${set({
        src: `${PUBLIC_URL}/assets/next.svg`,
        alt: direction === 'left' ? 'View previous comparison' : 'View next comparison'
      })}>
    </button>
  `;
}

function renderComparisonSquare(mainText, size, sizeDescription, { iconUrl, iconAlt = undefined, iconSize = 'regular-size', isForSnapFramework = false }) {
  return html`
    <div ${set({ className: 'comparison-square' + (isForSnapFramework ? ' for-snap-framework' : ' not-for-snap-framework') })}>
      <div class="comparison-square-inner">
        <h3 class="comparison-main-text" ${set({ textContent: mainText })}></h3>
        <div class="comparison-icon-with-explanation">
          <div class="comparison-icon-container">
            <img ${set({
              src: iconUrl,
              alt: iconAlt,
              className: 'comparison-icon' + (iconSize === 'slightly-larger' ? ' slightly-larger' : ' regular-size')
            })}>
          </div>
          <div class="comparison-size-container">
            <p class="comparison-size" ${set({ textContent: size })}></p>
            <p class="comparison-size-description" ${set({ textContent: sizeDescription })}></p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// The framework statistics are from https://en.wikipedia.org/wiki/Comparison_of_JavaScript-based_web_frameworks
const comparisons = [
  // The exact measurement I got when I gzipped it with the "gzip" CLI tool was 4215 bytes.
  () => renderComparisonSquare("This website's favicon", 'Around 4,000 bytes', 'compressed', {
    iconUrl: `${PUBLIC_URL}/favicon.ico`,
  }),
  // Exact value was 98.81 kB for v18.2.0 from 14 June 2022
  () => renderComparisonSquare("React", 'Around 100,000 bytes', 'minified + compressed', {
    iconUrl: `${PUBLIC_URL}/assets/react.svg`,
  }),
  // Exact value was 563 kB for v14.0.4 from 29 June 2022
  () => renderComparisonSquare("Angular", 'Around 550,000 bytes', 'minified + compressed', {
    iconUrl: `${PUBLIC_URL}/assets/angular.ico`,
  }),
  // Exact value was 33.5 KB for v2.6.10 from 20 March 2019
  () => renderComparisonSquare("Vue", 'Around 34,000 bytes', 'minified + compressed', {
    iconUrl: `${PUBLIC_URL}/assets/vue.svg`,
  }),
  // Exact value was 70.7KB for v3.6.0 from 3 March, 2021
  () => renderComparisonSquare("JQuery", 'Around 70,000 bytes', 'slim + minified + compressed', {
    iconUrl: `${PUBLIC_URL}/assets/jquery.ico`,
  }),
  // Exact value was 5647 bytes.
  // Source code was downloaded from https://github.com/lodash/lodash/blob/4.6.0-npm-packages/lodash.find/index.js,
  // minified with minify-js.com, and compressed with the gzip command line utility.
  () => renderComparisonSquare("Lodash's _.find()", 'Around 5,500 bytes', 'minified + compressed', {
    iconUrl: `${PUBLIC_URL}/assets/lodash.svg`,
  }),
];

withLifecycle(() => {
  document.head.append(html`
    <link rel="prefetch" ${set({ href: `${PUBLIC_URL}/favicon.ico` })}/>
    <link rel="prefetch" ${set({ href: `${PUBLIC_URL}/assets/react.svg` })}/>
    <link rel="prefetch" ${set({ href: `${PUBLIC_URL}/assets/angular.ico` })}/>
    <link rel="prefetch" ${set({ href: `${PUBLIC_URL}/assets/vue.svg` })}/>
    <link rel="prefetch" ${set({ href: `${PUBLIC_URL}/assets/jquery.ico` })}/>
    <link rel="prefetch" ${set({ href: `${PUBLIC_URL}/assets/lodash.svg` })}/>
  `);
});

const style = `
  ${headerStyleMixin}

  .file-size-comparison-region {
    display: flex;
    justify-content: center;
  }

  .comparison-square {
    min-width: 270px;
    display: flex;
    justify-content: center;
  }

  .comparison-main-text {
    margin-left: 12px;
  }

  .comparison-icon-with-explanation {
    display: flex;
  }

  .comparison-icon-container {
    display: flex;
    width: 80px;
    height: 80px;
    align-items: center;
    justify-content: center;
    background: #eee;
    border-radius: 50%;
    margin-right: 20px;
  }

  .comparison-icon.regular-size {
    width: 48px;
    height: 48px;
  }

  .comparison-icon.slightly-larger {
    width: 52px;
    height: 52px;
  }

  .comparison-size-container {
    /* Setting it to a fixed width prevents the icon from bobbing around as you push the next button. */
    min-width: 170px;
  }
  
  .comparison-size {
    font-size: 1rem;
    margin-bottom: 0;
  }

  .comparison-size-description {
    font-size: 0.8rem;
    margin-top: 0.05em;
  }

  .vs {
    font-size: 1.3rem;
    align-self: center;
    margin-left: 50px;
    margin-right: 50px;
  }

  .switch-comparison {
    border: none;
    background: white;
    margin-left: 30px;
    margin-top: 15px;
    cursor: pointer;
    opacity: 0.6;
    &:hover {
      background: ${ICON_BUTTON_BACKGROUND_ON_HOVER};
    }
    &:focus {
      outline: ${ICON_BUTTON_OUTLINE_ON_FOCUS};
    }
    img {
      width: 32px;
      height: 96px;
    }

    &.left img {
      transform: scaleX(-1);
    }

    &.transparent {
      visibility: hidden;
      pointer-events: none;
    }

    &.not-rendered {
      display: none;
    }
  }

  @media screen and (max-width: ${MOBILE_SCREEN_SIZE}) {
    .comparison-square-inner {
      background: #eee;
      padding: 5px 20px 17px;
      border-radius: 10px;
    }

    .for-snap-framework .comparison-square-inner {
      background: #eef7ee;
    }

    .comparison-main-text {
      margin-bottom: 0.5em;
      margin-left: 0;
      font-size: 1.1rem;
    }

    .comparison-icon-container {
      background: unset;
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }

    .comparison-icon.regular-size {
      width: 32px;
      height: 32px;
    }

    .comparison-icon.slightly-larger {
      width: 35px;
      height: 35px;
    }

    .comparison-size {
      margin-top: 0;
    }

    .file-size-comparison-region {
      flex-flow: column;
    }

    .switch-comparison {
      margin-left: 5px;
      margin-top: 0px;
    }

    .comparison-and-mobile-next-button {
      display: flex;
      justify-content: center;
    }

    .not-for-snap-framework .comparison-square-inner {
      padding: 25px 50px 35px;
    }
  }

  @media screen and (max-width: 450px) {
    .not-for-snap-framework .comparison-square-inner {
      padding: 15px 30px 25px;
    }
  }
`;
