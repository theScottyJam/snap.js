import { CodeViewer } from '../CodeViewer.js';
import { html } from '../snapFramework.js';
import { defineStyledElement } from '../shared.js';
import { doesCodeBlockHaveChoices, replaceWithCodeBlockWithChoices } from './codeBlockWithChoices.js';

/**
 * Markdown that has been pre-compiled into HTML can be rendered by this component.
 * This component will automatically add appropriate styles to the markdown content.
 */
export const MarkDown = defineStyledElement('MarkDown', getStyles, ({ signalContentHtml, removeVerticalMargins }) => {
  let containerEl;
  const fragment = html`
    <div ${containerEl_ => { containerEl = containerEl_ }}></div>
  `;

  if (removeVerticalMargins) {
    containerEl.classList.add('no-vertical-margins');
  }

  signalContentHtml.use(contentHtml => {
    // Place the HTML into a temporary container while do some edits to it and prepare it for viewing.
    const temporaryContainerEl = document.createElement('div');
    temporaryContainerEl.innerHTML = contentHtml;
    for (const codeContainerEl of temporaryContainerEl.querySelectorAll('pre:has(code)')) {
      if (doesCodeBlockHaveChoices(codeContainerEl.textContent)) {
        replaceWithCodeBlockWithChoices(codeContainerEl);
      } else {
        replaceWithCodeBlock(codeContainerEl);
      }
    }

    // Move the prepared HTML onto the page.
    containerEl.innerHTML = '';
    containerEl.append(...temporaryContainerEl.childNodes);
  });

  return fragment;
});

function replaceWithCodeBlock(codeContainerEl) {
  const el = new CodeViewer(codeContainerEl.textContent);
  codeContainerEl.after(el);
  codeContainerEl.parentNode.removeChild(codeContainerEl);
}

function getStyles() {
  return `
    :host {
      font-size: 0.9rem;
      line-height: 1.5em;
    }

    .no-vertical-margins p {
      margin-top: 0;
      margin-bottom: 0;
    }

    h1 {
      line-height: 1.1em;
      @media (max-width: 400px) {
        font-size: 1.6rem;
      }
    }
    
    code {
      background: #ddd;
      padding: 0 2px;
      overflow-wrap: break-word;
    }

    ${customElements.getName(CodeViewer)} {
      padding: 8px;
      background: #fafafa;
    }
  `;
}
