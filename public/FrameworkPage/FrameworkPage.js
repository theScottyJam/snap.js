/* eslint-disable react-hooks/rules-of-hooks */

import { html, renderChoice, set, Signal, useCleanup, useSignals, withLifecycle } from './snapFramework.js';
import { SourceViewerSection } from './SourceViewerSection.js';
import { FeatureShowcaseSection } from './FeatureShowcaseSection.js';
import { PUBLIC_URL } from './shared.js';
import { headerStyleMixin } from './sharedStyles.js';
import { OverviewSection } from './OverviewSection.js';
import { WithTooltip } from './WithTooltip.js';
import { AdditionalInformationSection } from './AdditionalInformationSection.js';

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
    <div style="height: 20px"></div>
    ${new FeatureShowcaseSection()}
    <h2 class="header has-section-description">— GRAB 'N GO —</h2>
    <!-- Whenever the framework gets updated, this statistic needs to be updated as well - search the project for §u5gEq for more info. -->
    <p class="section-description">All ${renderTextWithTooltip('195 lines', 'Excluding whitespace and comments')} of code shown below are just a copy-paste away from being yours.</p>
    ${new SourceViewerSection({ fullText, minifiedText })}
    <h2 class="header">— Additional Guidelines —</h2>
    ${new AdditionalInformationSection()}
  `;
}

function renderTextWithTooltip(text, tooltip) {
  return html`
    ${new WithTooltip({
      child: html`<span class="hoverable-text" ${set({ textContent: text })}></span>`,
      tooltip
    })}
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
    margin-left: 0.5em;
    margin-right: 0.5em;
    text-align: center;
  }

  .hoverable-text {
    text-decoration: underline;
    text-decoration-style: dotted;
  }
`;
