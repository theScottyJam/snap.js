/* eslint-disable react-hooks/rules-of-hooks */

import { html, renderChoice, set, Signal, useCleanup, useSignals, withLifecycle } from './snapFramework.js';
import { SourceViewerSection } from './SourceViewerSection.js';
import { FootprintComparisonSection } from './FootprintComparisonSection.js';
import { FeatureShowcaseSection } from './FeatureShowcaseSection.js';
import { PUBLIC_URL } from './shared.js';
import { headerStyleMixin } from './sharedStyles.js';
import { OverviewRegion } from './OverviewRegion.js';

export class FrameworkPage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    const { uninit, value: el } = withLifecycle(() => this.#renderFrameworkPage());
    shadowRoot.append(el);
    this.api = { uninit };
  };

  #renderFrameworkPage() {
    const snapFrameworkText$ = new Signal(undefined);
    const loadFailed$ = new Signal(false);

    const abortController = new AbortController();
    fetch(`${PUBLIC_URL}/FrameworkPage/snapFramework.js`, { siganl: abortController.signal })
      .then(async resp => {
        if (!resp.ok) {
          throw new Error('Failed to load the required snapFramework.js file.');
        }
        snapFrameworkText$.set(await resp.text());
      })
      .catch(error => {
        loadFailed$.set(true);
        throw error;
      });
    
    useCleanup(() => abortController.abort());
  
    return html`
      ${renderChoice([
        {
          when$: snapFrameworkText$,
          render: () => renderPageContents(snapFrameworkText$.get()),
        },
        {
          when$: loadFailed$,
          render: renderLoadFailed,
        },
        {
          when$: new Signal(true),
          render: renderLoading
        },
      ])}

      <style ${set({ textContent: style })}></style>
    `;
  }

  static {
    customElements.define(`snapjs-framework-page`, FrameworkPage);
  }
}

function renderLoading() {
  const opacity$ = new Signal(0);

  const timeoutId = setTimeout(() => opacity$.set(1), 1000);
  useCleanup(() => clearTimeout(timeoutId));

  return html`
    <p class="loading" ${set({
      style: useSignals([opacity$], opacity => `opacity: ${opacity}`)
    })}>
      Loading...
    </p>
  `;
}

function renderLoadFailed() {
  return html`
    <p class="load-failed">Failed to load page.</p>
  `;
}

function renderPageContents(snapFrameworkText) {
  return html`
    ${new OverviewRegion()}
    <h2 class="header">— SMALL —</h2>
    ${new FootprintComparisonSection()}
    <h2 class="header powerful-header">— POWERFUL —</h2>
    ${new FeatureShowcaseSection()}
    <h2 class="header hackable-header">— HACKABLE —</h2>
    ${new SourceViewerSection(snapFrameworkText)}
  `;
}

const style = `
  ${headerStyleMixin}

  .loading {
    color: #555;
    margin-left: 20px;
    transition: opacity 0.1s;
  }

  .load-failed {
    color: #a00;
    margin-left: 20px;
    font-weight: bold;
    letter-spacing: 0.08em;
  }

  .header {
    color: rgb(0, 41, 34);
    font-size: 1.4rem;
    text-align: center;
    letter-spacing: 0.2em;
    margin-top: 3em;
    margin-bottom: 1.5em;
  }

  .header:first-of-type {
    margin-top: 2em;
  }
`;
