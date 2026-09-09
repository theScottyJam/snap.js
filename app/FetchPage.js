import { CodeViewer } from './CodeViewer.js';
import { MarkDown } from './MarkDown.js';
import { defineStyledElement, jumpToInternalLinkTarget, setPageBaseTitle } from './shared.js';
import { CODE_WINDOW_BORDER_RADIUS } from './sharedStyles.js';
import { html, renderChoice, set, Signal } from './snapFramework.js';
import { WithTooltip } from './WithTooltip.js';

export const FetchPage = defineStyledElement('FetchPage', getStyles, ({ fetchPageHtml }) => {
  setPageBaseTitle('Fetch');

  return new MarkDown({
    signalContentHtml: new Signal(fetchPageHtml),
    codeBlockTheme: 'dark',
    createCodeBlock,
    postProcess,
    getStyle: getMarkDownStyle,
  });
});

function postProcess(markdownEl) {
  for (const linkEl of markdownEl.querySelectorAll('[data-click-target]')) {
    linkEl.addEventListener('click', () => {
      jumpToInternalLinkTarget(linkEl.dataset.clickTarget);
    });
  }

  for (const el of markdownEl.querySelectorAll('[data-tooltip]')) {
    el.classList.add('tooltip-target');
    const placeholder = document.createElement('div');
    el.after(placeholder);
    const tooltip = new WithTooltip({ child: el, tooltip: el.dataset.tooltip, wrap: true });
    placeholder.after(tooltip);
    placeholder.remove();
  }
}

function createCodeBlock(text) {
  const selectAllButtonMatch = /\/\/# selectAllButton.*/.exec(text);
  text = selectAllButtonMatch === null
    ? text
    : text.slice(0, selectAllButtonMatch.index) + text.slice(selectAllButtonMatch.index + selectAllButtonMatch[0].length + 1); // + 1 to remove the new line
  const showSelectAllButton = selectAllButtonMatch !== null;

  const codeViewer = new CodeViewer(text, { theme: 'dark' });

  return html`
    ${renderChoice([{
      signalWhen: new Signal(showSelectAllButton),
      render: () => html`
        <div class="fetch-page-select-all-container">
          <button ${set({
            onclick: () => {
              const selection = window.getSelection();
              const range = document.createRange();
              range.setStartBefore(codeViewer);
              range.setEndAfter(codeViewer);
              selection.removeAllRanges();
              selection.addRange(range);
            },
          })}>
            Select all
          </button>
        </div>
      `,
    }])}
    ${codeViewer}
  `;
}

function getMarkDownStyle() {
  return `
    .fetch-page-select-all-container {
      position: absolute;
      right: 0;
    }

    /* Similar styles are found at §CpxFg */
    .fetch-page-select-all-container button {
      /*
        This allows the ::after pseudo-element to be absolutely positioned inside of the button.
        And we use it to shift the button over a bit.
      */
      position: relative;
      top: 8px;
      right: 8px;

      color: #ccc;
      background: #272822;
      font-size: 0.8rem;
      padding: 6px 7px;
      letter-spacing: 0.08em;
      cursor: pointer;

      border-radius: 6px;
      border: 1px solid #ccc;

      &:not([disabled]):hover {
        color: white;
        border: 1px solid white;
        outline: 1px solid #aaa;
      }
      &:focus::after {
        content: '';
        position: absolute;
        border-radius: 4px;
        border: 1px solid #ccc;
        left: 1px;
        right: 1px;
        bottom: 1px;
        top: 1px;
      }
    }

    ${customElements.getName(CodeViewer)} {
      background: #272822;
      border-radius: ${CODE_WINDOW_BORDER_RADIUS};
      &.fetch-page-has-file-name {
        border-top-left-radius: 0;
      }
    }

    .tooltip-target {
      text-decoration: underline;
      text-decoration-style: dotted;
    }
  `;
}

function getStyles() {
  return `
    :host {
      display: block;
      margin: 50px auto 80px;
      width: 850px;
      position: relative;
      @media (max-width: 900px) {
        width: 90vw;
        margin-left: 5vw;
      }
    }
  `;
}
