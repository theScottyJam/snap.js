import { classNameBuilder, defineStyledElement } from './shared.js';
import { assert } from './util.js';
import { html, set, Signal } from './snapFramework.js';

/**
 * If `wrap` is provided, the tooltip text will be able to wrap, but at the cost of using fixed-sized containers which
 * looks a little weird if the text is too small to wrap.
 */
export const WithTooltip = defineStyledElement('WithTooltip', getStyles, function ({ child, tooltip, anchor = 'left', wrap }) {
  this.append(child);
  const signalShowPopup = new Signal(false);
  assert(['left', 'right'].includes(anchor));

  return html`
    <button ${set({
      tabIndex: 0, // Allow this element to receive focus with the keyboard
      onmouseover: () => signalShowPopup.set(true),
      onmouseout: () => signalShowPopup.set(false),
      // Some of these events are here, in part, to handle hiding/showing the popup with the keyboard.
      onclick: event => {
        // Stop propagation, so if this is inside of a larger button, the larger button
        // won't count as being clicked when the element gets clicked.
        signalShowPopup.set(true);
        event.stopPropagation();
      },
      onblur: () => {
        signalShowPopup.set(false);
      },
    })}>
      <slot></slot>
      <span ${set({
        className: classNameBuilder({
          tooltip: new Signal(true),
          wrap: new Signal(wrap),
        }),
        textContent: tooltip,
        style: signalShowPopup.use(showPopup => {
          return `${anchor}: 0` + (showPopup ? '' : '; display: none');
        }),
      })}></span>
    </button>
  `;
});

function getStyles() {
 return `
    button {
      /* Removes default button styling */
      all: unset;

      cursor: help;
      /* Allows the popup to be positioned relative to this box */
      position: relative;
      &:focus {
        outline: revert;
      }
    }

    .tooltip {
      /* Ensures inherited styles don't bleed through */
      all: initial;

      pointer-events: none;
      position: absolute;
      top: calc(100% + 0.3em);
      background: white;
      border: 1px solid black;
      padding: 3px;
      box-sizing: border-box;
      z-index: 9999;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.04);

      &:not(.wrap) {
        text-wrap: nowrap;
      }

      &.wrap {
        width: 400px;
        @media screen and (max-width: 800px) {
          & {
            width: 230px;
          }
        }

        @media screen and (max-width: 500px) {
          & {
            width: 160px;
          }
        }
      }
    }
  `;
}
