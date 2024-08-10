/* eslint-disable no-template-curly-in-string */

import { PUBLIC_URL } from './shared.js';
import { headerStyleMixin, ICON_BUTTON_BACKGROUND_ON_HOVER, ICON_BUTTON_OUTLINE_ON_FOCUS } from './sharedStyles.js';
import { defineElement, html, renderChoice, set, Signal, useSignals } from './snapFramework.js';

const randomInt = max => Math.floor(Math.random() * max);

export const FootprintComparisonSection = defineElement('FootprintComparisonSection', () => {
  const currentComparison$ = new Signal(randomInt(comparisons.length));
  return html`
    <div class="file-size-comparison-region">
      <!-- // <-- TODO: Find a better way to handle this. Also see if I can keep the icons from shifting as you push next. -->
      <!-- This button is only here to help position the content in the center -->
      <button class="next-comparison" style="visibility: hidden; pointer-events: none">
        <img ${set({ src: `${PUBLIC_URL}/assets/next.svg` })} alt="View next comparison">
      </button>
      <!--
      The exact measurement I got when I last checked after minifying
      with minify-js.com and gzipping it with the "gzip" CLI tool was 1429 bytes.
      -->
      ${renderComparisonSquare('Snap Framework', 'Less than 1,500 bytes', 'minified + compressed', {
        iconUrl: `${PUBLIC_URL}/assets/file.svg`,
        iconAlt: 'Icon representing the framework',
        iconSize: '52px',
      })}
      <p class="vs">VS.</p>
      ${renderChoice(
        comparisons.map((renderComparison, i) => ({
          signalWhen: useSignals([currentComparison$], currentComparison => currentComparison === i),
          render: renderComparison,
        }))
      )}
      <button class="next-comparison" title="Next Comparison" ${set({
        onclick: () => {
          const newIndex = currentComparison$.get() + 1;
          currentComparison$.set(newIndex >= comparisons.length ? 0 : newIndex);
        }
      })}>
        <img ${set({ src: `${PUBLIC_URL}/assets/next.svg` })} alt="View next comparison">
      </button>
    </div>

    <style ${set({ textContent: style })}></style>
  `;
});

function renderComparisonSquare(mainText, size, sizeDescription, { iconUrl, iconAlt = undefined, iconSize = '48px' }) {
  return html`
    <div class="comparison-square">
      <div class="comparison-square-inner">
        <h3 class="comparison-main-text" ${set({ textContent: mainText })}></h3>
        <div class="comparison-icon-with-explanation">
          <div class="comparison-icon-container">
            <img ${set({ src: iconUrl, alt: iconAlt, style: `width: ${iconSize}; height: ${iconSize}` })}>
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

  .next-comparison {
    margin-left: 30px;
    margin-top: 15px;
    border: none;
    background: white;
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
  }
`;
