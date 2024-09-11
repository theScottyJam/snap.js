import { defineElement, html, set, Signal, useSignals } from "./snapFramework.js";

export const WithTooltip = defineElement('WithTooltip', function({ child, tooltip, anchor = 'left', getStyle = undefined }) {
  this.append(child);
  const showPopup$ = new Signal(false);
  console.assert(['left', 'right'].includes(anchor));

  return html`
    <button ${set({
      tabIndex: 0, // Allow this element to receive focus with the keyboard
      onmouseover: () => showPopup$.set(true),
      onmouseout: () => showPopup$.set(false),
      // Some of these events are here, in part, to handle hiding/showing the popup with the keyboard.
      onclick: event => {
        // Stop propagation, so if this is inside of a larger button, the larger button
        // won't count as being clicked when the element gets clicked.
        showPopup$.set(true);
        event.stopPropagation();
      },
      onblur: () => {
        showPopup$.set(false);
      },
    })}>
      <slot></slot>
      <span class="tooltip" ${set({
        textContent: tooltip,
        style: useSignals([showPopup$], showPopup => {
          return `${anchor}: 0` + (showPopup ? '' : '; display: none');
        }),
      })}></span>
    </button>

    <style ${set({ textContent: style })}></style>
    <style ${set({ textContent: getStyle?.('.tooltip') ?? '' })}></style>
  `;
});

const style = `
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
    text-wrap: nowrap;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.04);
  }
`;
