import { html, set, Signal } from '../snapFramework.js';
import { MarkDown } from '../MarkDown/MarkDown.js';
import { defineStyledElement, extractUtilityPageTypeFromRoute } from '../shared.js';

export const DocEntry = defineStyledElement('DocEntry', getStyles, ({ entry, pageInfo }) => {
  const { signalPage, setSignalPage } = pageInfo;
  const { fnSignature, summaryHtml } = entry.manifest;
  const path = [extractUtilityPageTypeFromRoute(signalPage.get()), entry.name].join('/');
  return html`
    <a class="fn-signature" ${set({
      href: '#!/' + path,
      onclick: () => setSignalPage(path),
    })}>
      <code ${set({ textContent: fnSignature })}></code>
    </a>

    ${set({ className: 'summary' })(new MarkDown({
      signalContentHtml: new Signal(summaryHtml),
      removeVerticalMargins: true,
    }))}
  `;
});

function getStyles() {
  return `
    :host {
      display: block;
    }

    .fn-signature {
      color: #027;
      background: #ddd;
      padding: 2px 4px;
      cursor: pointer;
      font-size: 0.9rem;
      text-decoration: unset;
    }

    .summary {
      display: block;
      margin: 7px 0 20px 20px;
      font-size: 0.9rem;
      line-height: 1.5em;
    }
  `;
}
