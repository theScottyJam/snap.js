import { CodeViewer } from '../CodeViewer.js';
import { html, renderChoice, set, Signal } from '../snapFramework.js';
import { MarkDown } from '../MarkDown/MarkDown.js';
import { defineStyledElement, extractUtilityPageTypeFromRoute, lookupContentEntryFromRoute } from '../shared.js';

export const SingleEntryPage = defineStyledElement('SingleEntryPage', getStyles, ({ signalContent, pageInfo }) => {
  const { signalPage } = pageInfo;
  const signalPageData = Signal.use([signalContent, signalPage], (content, page) => lookupContentEntryFromRoute(content, page));

  return renderChoice([
    {
      signalWhen: signalPageData.use(pageData => pageData === null),
      render: () => renderNotFound({ pageInfo }),
    },
    {
      signalWhen: signalPage.use(page => {
        const topLevelPage = extractUtilityPageTypeFromRoute(page);
        return topLevelPage === 'nolodash';
      }),
      render: () => renderNolodashSingleEntryPage({ signalPageData, pageInfo }),
    },
    {
      signalWhen: new Signal(true),
      render: () => renderDefaultSingleEntryPage({ signalPageData, pageInfo }),
    },
  ]);
});

function renderDefaultSingleEntryPage({ signalPageData, pageInfo }) {
  return html`
    <div>
      ${renderBackButton({ pageInfo })}
      <h1 class="entry-header" ${set({
        textContent: signalPageData.use(pageData => pageData.name + '()'),
      })}></h1>
      ${renderChoice([
        {
          signalWhen: signalPageData.use(pageData => pageData.hidden),
          render: () => renderUnlistedWarning(),
        },
      ])}
      ${renderChoice([
        {
          signalWhen: signalPageData.use(pageData => pageData.src),
          render: () => renderCode({
            signalSrc: signalPageData.use(pageData => pageData.src),
          }),
        },
      ])}
      ${renderDescription({
        signalSummaryHtml: signalPageData.use(pageData => pageData.manifest.summaryHtml),
        signalDescriptionHtml: signalPageData.use(pageData => pageData.descriptionHtml),
      })}
    </div>
  `;
}

function renderNolodashSingleEntryPage({ signalPageData, pageInfo }) {
  return html`
    <div>
      ${renderBackButton({ pageInfo })}
      <h1 class="entry-header">Lodash's version</h1>
      <a class="fn-signature-link" ${set({
        href: signalPageData.use(pageData => pageData.manifest.lodashLink),
      })}>
        <pre ${set({
          textContent: signalPageData.use(pageData => pageData.manifest.fnSignature),
        })}></pre>
      </a>
      ${renderChoice([
        {
          signalWhen: signalPageData.use(pageData => pageData.src),
          render: () => renderCode({
            signalSrc: signalPageData.use(pageData => pageData.src),
          }),
        },
      ])}
      ${renderDescription({
        signalSummaryHtml: signalPageData.use(pageData => pageData.manifest.summaryHtml),
        signalDescriptionHtml: signalPageData.use(pageData => '<h1>Plain JavaScript</h1>' + pageData.descriptionHtml),
      })}
    </div>
  `;
}

function renderNotFound({ pageInfo }) {
  return html`
    <div>
      ${renderBackButton({ pageInfo })}
      <h1>Page not found</h1>
    </div>
  `;
}

function renderBackButton({ pageInfo }) {
  const { signalPage, setSignalPage } = pageInfo;
  const signalPath = signalPage.use(page => extractUtilityPageTypeFromRoute(page) ?? 'utils');
  return html`
    <a class="back-button" ${set({
      href: signalPath.use(path => '#!/' + path),
      onClick: () => setSignalPage(signalPath.get()),
    })}>
      Back to Overview
    </a>
  `;
}

function renderUnlistedWarning() {
  return html`
    <div class="unlisted">
      <p>
        <strong>This entry is now unlisted.</strong>
      </p>
      <p>
        If you happen to have a direct link to it you'd still be able to view
        it, but you won't see it listed in the overview page anymore. Entries
        become unlisted typically because another version of the entry got
        created on the "Lodash Replacements" page that's either equally
        informative, or more informative than this entry.
      </p>
    </div>
  `;
}

function renderDescription({ signalDescriptionHtml, signalSummaryHtml }) {
  return new MarkDown({
    signalContentHtml: Signal.use([signalDescriptionHtml, signalSummaryHtml], (descriptionHtml, summaryHtml) => {
      return summaryHtml + descriptionHtml;
    }),
  });
}

function renderCode({ signalSrc }) {
  const codeViewer = new CodeViewer(signalSrc, { theme: 'dark' });
  codeViewer.classList.add('primary-code-sample');
  return codeViewer;
}

function getStyles() {
  return `
    .back-button {
      background: #ccc;
      color: #111;
      border: none;
      padding: 5px 10px;
      font-size: 1rem;
      cursor: pointer;
      text-decoration: unset;
    }

    .entry-header {
      fontsize: 1.7rem;
      fontfamily: 'Roboto Mono', monospace;
      @media (max-width: 400px) {
        font-size: 1.6rem;
      }
    }

    .fn-signature-link {
      color: #222;
      font-weight: bold;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    .unlisted {
      display: flex;
      flex-flow: column;
      gap: 16px;
      background: #fcd;
      border: #f00;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 8px;
      & > * {
        margin: 0;
      }
    }

    .primary-code-sample {
      background: #282c34;
      padding: 8px;
      font-size: 0.9rem;
      line-height: 1.5em;
    }
  `;
}
