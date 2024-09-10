/* eslint-disable react-hooks/rules-of-hooks */

import { html, renderChoice, set, Signal, useCleanup, useSignals, withLifecycle } from './snapFramework.js';
import { SourceViewerSection } from './SourceViewerSection.js';
import { FootprintComparisonSection } from './FootprintComparisonSection.js';
import { FeatureShowcaseSection } from './FeatureShowcaseSection.js';
import { PUBLIC_URL } from './shared.js';
import { headerStyleMixin } from './sharedStyles.js';
import { OverviewSection } from './OverviewSection.js';

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

    const getTextResponse = resp => {
      if (!resp.ok) {
        throw new Error(`Failed to load a required resource - error code: ${resp.code}`);
      }
      return resp.text();
    };

    const abortController = new AbortController();
    Promise.all([
      fetch(`${PUBLIC_URL}/FrameworkPage/snapFramework.js`, { siganl: abortController.signal })
        .then(getTextResponse),
      fetch(`${PUBLIC_URL}/FrameworkPage/snapFramework.min.js`, { siganl: abortController.signal })
        .then(getTextResponse),
    ]).then(async ([fullText, minifiedText]) => {
        snapFrameworkText$.set({ fullText, minifiedText });
      })
      .catch(error => {
        loadFailed$.set(true);
        throw error;
      });
    
    useCleanup(() => abortController.abort());
  
    return html`
      ${renderChoice([
        {
          signalWhen: snapFrameworkText$,
          render: () => renderPageContents(snapFrameworkText$.get()),
        },
        {
          signalWhen: loadFailed$,
          render: renderLoadFailed,
        },
        {
          signalWhen: new Signal(true),
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

function renderPageContents({ fullText, minifiedText }) {
  return html`
    ${new OverviewSection()}
    <h2 class="header">— SMALL —</h2>
    ${new FootprintComparisonSection()}
    <h2 class="header">— POWERFUL —</h2>
    ${new FeatureShowcaseSection()}
    <h2 class="header has-section-description">— GRAB 'N GO —</h2>
    <p class="section-description">All ${renderTextWithHoverInfo('201 lines', 'Excluding whitespace and comments')} of code shown below are just a copy-paste away from being yours.</p>
    ${new SourceViewerSection({ fullText, minifiedText })}
  `;
}

function renderTextWithHoverInfo(text, hoverText) {
  const showPopup$ = new Signal(false);
  return html`
    <span class="hoverable-text">
      <span ${set({
        textContent: text,
        onmouseover: () => showPopup$.set(true),
        onmouseout: () => showPopup$.set(false),
      })}></span>
      <span class="hover-text-popup" ${set({
        textContent: hoverText,
        style: useSignals([showPopup$], showPopup => showPopup ? '' : 'display: none'),
      })}></span>
    </span>
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
    margin-top: 3.25em;
    margin-bottom: 1.5em;
    &.has-section-description {
      margin-bottom: 0.8em;
    }
  }

  .section-description {
    margin-top: 0;
    margin-bottom: 2em;
    text-align: center;
  }

  .hoverable-text {
    cursor: help;
    text-decoration: underline;
    text-decoration-style: dotted;
    /* Allows the popup to be positioned relative to this box */
    position: relative;
  }

  .hover-text-popup {
    pointer-events: none;
    position: absolute;
    top: 1.3em;
    left: 0;
    background: white;
    border: 1px solid black;
    padding: 3px;
    box-sizing: border-box;
    text-wrap: nowrap;
  }
`;
