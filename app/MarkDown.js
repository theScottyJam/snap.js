import { CodeViewer } from './CodeViewer.js';
import { html, set } from './snapFramework.js';
import { defineStyledElement } from './shared.js';

/**
 * Markdown that has been pre-compiled into HTML can be rendered by this component.
 * This component will automatically add appropriate styles to the markdown content.
 *
 * If getStyle() is used to style elements not controlled by this class, make sure they have a unique prefix to avoid name collisions.
 */
export const MarkDown = defineStyledElement('MarkDown', getStyles, opts => {
  const { signalContentHtml, removeVerticalMargins, createCodeBlock = undefined, postProcess = undefined, getStyle = undefined } = opts;

  let containerEl;
  const fragment = html`
    <div ${containerEl_ => { containerEl = containerEl_ }}></div>
    <style ${set({
      // Wrap it in `:host` to make sure its specificity is higher than any existing CSS we use,
      // so it's capable of overriding any rules.
      textContent: ':host {\n' + (getStyle?.() ?? '') + '\n}',
    })}></style>
  `;

  if (removeVerticalMargins) {
    containerEl.classList.add('no-vertical-margins');
  }

  signalContentHtml.use(contentHtml => {
    // Place the HTML into a temporary container while do some edits to it and prepare it for viewing.
    const temporaryContainerEl = document.createElement('div');
    temporaryContainerEl.innerHTML = contentHtml;
    for (const codeContainerEl of temporaryContainerEl.querySelectorAll('pre:has(code)')) {
      let el;
      if (createCodeBlock !== undefined) {
        el = createCodeBlock(codeContainerEl.textContent);
      } else {
        el = new CodeViewer(codeContainerEl.textContent);
      }

      codeContainerEl.after(el);
      codeContainerEl.parentNode.removeChild(codeContainerEl);
    }

    for (const linkEl of temporaryContainerEl.querySelectorAll('a')) {
      linkEl.rel = 'noreferrer';
    }

    // Move the prepared HTML onto the page.
    containerEl.innerHTML = '';
    containerEl.append(...temporaryContainerEl.childNodes);
    postProcess?.(containerEl);
  });

  return fragment;
});

function getStyles() {
  // Keep the specificity low so CSS overrides can be provided. Specificity shouldn't be greater than a single class.
  return `
    :host {
      font-size: 0.9rem;
      line-height: 1.5em;
    }

    .no-vertical-margins :where(p) {
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

    /* Base styles that may be manually overwritten */
    ${customElements.getName(CodeViewer)} {
      padding: 8px;
      background: #fafafa;
    }
  `;
}
