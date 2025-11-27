import { html, renderChoice, renderEach, set, Signal } from '../snapFramework.js';
import { MarkDown } from '../MarkDown/MarkDown.js';
import { defineStyledElement, extractUtilityPageTypeFromRoute } from '../shared.js';
import { assert } from '../util.js';
import { DocEntry } from './DocEntry.js';

export const OverviewPage = defineStyledElement('OverviewPage', getStyles, ({ signalContent, pageInfo }) => {
  const { signalPage } = pageInfo;

  const signalFilterText = new Signal('');
  const signalUtilityPageType = signalPage.use(page => {
    const utilityPageType = extractUtilityPageTypeFromRoute(page);
    assert(utilityPageType !== null);
    return utilityPageType;
  });
  const signalPageHasFilterBox = signalUtilityPageType.use(utilityPageType => utilityPageType === 'nolodash');

  const signalFilteredPageContent = Signal.use(
    [signalContent, signalUtilityPageType],
    (content, utilityPageType) => {
      return filterContent(content[utilityPageType], { signalPageHasFilterBox, signalFilterText });
    }
  );

  const signalIsPageEmpty = new Signal(false);
  signalFilteredPageContent.use(pageContent => {
    Signal.use(pageContent.map(section => section.signalEntries), (...entries) => {
      signalIsPageEmpty.set(entries.every(entry => entry.length === 0));
    });
  });

  return html`
    ${renderPageSummary({
      signalTopLevelPage: signalUtilityPageType,
      signalPageContent: Signal.use([signalContent, signalUtilityPageType], (content, utilityPageType) => content[utilityPageType])
    })}
    ${renderChoice([
      {
        signalWhen: signalPageHasFilterBox,
        render: () => renderFilterBox({ signalFilterText }),
      }
    ])}
    ${renderChoice([
      {
        signalWhen: Signal.use(
          [signalIsPageEmpty, signalContent, signalUtilityPageType],
          (isPageEmpty, content, utilityPageType) => isPageEmpty && content[utilityPageType],
        ),
        render: () => html`
          <i class="no-results">No Results</i>
        `,
      }
    ])}
    ${renderEach(
      signalFilteredPageContent.use(filteredPageContent => {
        // Using Math.random() for the key to force all values to be re-rendered each time.
        // signalFilteredPageContent only gets updated when major changes to the page content happens anyways,
        // so a full refresh of the content is good.
        return filteredPageContent.flatMap(section => section.hidden ? [] : [[Math.random(), section]]);
      }),
      ({ categoryHeading, signalEntries }) => {
        return renderCategory({ heading: categoryHeading, signalEntries, pageInfo });
      }
    )}
  `;
});

function renderCategory({ heading, signalEntries, pageInfo }) {
  return renderChoice([
    {
      signalWhen: signalEntries.use(entries => entries.length === 0),
      render: () => html``,
    },
    {
      signalWhen: new Signal(true),
      render: () => html`
        <h1 class="category-name" ${set({ textContent: heading })}></h1>
        ${renderEach(
          signalEntries.use(entries => entries.map(entry => [entry.name, entry])),
          entry => new DocEntry({ entry, pageInfo }),
        )}
      `
    },
  ])
}

function renderPageSummary({ signalTopLevelPage, signalPageContent }) {
  return renderChoice([
    {
      signalWhen: signalTopLevelPage.use(topLevelPage => topLevelPage === 'utils'),
      render: () => html`
        <h2>Simple Utilities</h2>
        <p>
          These are a handful of various copy-paste-friendly utility functions,
          that are ready to be mixed into any project that might need them.
        </p>
        <p>
          This page was created before the "Lodash Replacements" page. I have
          since removed most entries from this page, because the same
          information could be found in the "Lodash Replacements" section. In
          the future, I may add things like utility TypeScript types and
          what-not to this page - things that Lodash does not cover.
        </p>
      `,
    },
    {
      signalWhen: signalTopLevelPage.use(topLevelPage => topLevelPage === 'nolodash'),
      render: () => html`
        <h2>Lodash Replacements</h2>
        <p>
          This is intended to be a complete catalog of all the functions that
          <a href="https://lodash.com">Lodash</a> provides, along with a
          description of how one would go about doing the same thing in plain
          JavaScript.
        </p>
        <p>
          If you ever see in any of the examples a built-in function that you
          wish to learn more about, please search
          <a href="https://developer.mozilla.org/en-US/">MDN</a> for an in-depth
          explanation about that particular function.
        </p>
        <p>
          This page is still a work-in-progress. There are currently
          <span ${set({
            textContent: signalPageContent.use(pageContent => {
              return pageContent.flatMap(section => section.entries).length;
            })
          })}></span> out of 294 entries that have been done,
          and more are constantly being added to this page. If you see any
          issues on any of the existing entries, or if you have any suggestions
          for improvement, please
          <a href="https://github.com/theScottyJam/snap.js/issues">
            open an issue on GitHub
          </a>
          .
        </p>
        <details>
          <summary>
            <strong>FAQ</strong>
          </summary>
          ${renderNolodashFaq()}
        </details>
      `
    },
    {
      signalWhen: new Signal(true),
      render: () => html``,
    }
  ]);
}

// { type: 'unready' | 'loading' } { type: 'ready', value: string }
const signalNolodashFaq = new Signal({ type: 'unready' });

function renderNolodashFaq() {
  if (signalNolodashFaq.get().type === 'unready') {
    signalNolodashFaq.set({ type: 'loading' });
    (async function() {
      try {
        const responseText = await fetch('nolodashFaq.html')
          .then(response => {
            if (!response.ok) throw new Error('non-2xx response received while fetching FAQ.')
            return response.text();
          });
        signalNolodashFaq.set({ type: 'ready', value: responseText });
      } catch (error) {
        signalNolodashFaq.set({ type: 'unready' });
        throw error;
      }
    })();
  }

  return renderChoice([
    {
      signalWhen: signalNolodashFaq.use(nolodashFaq => nolodashFaq.type === 'unready'),
      render: () => html`<p>Failed to load the FAQ</p>`,
    },
    {
      signalWhen: signalNolodashFaq.use(nolodashFaq => nolodashFaq.type === 'loading'),
      render: () => html`<p>Loading...</p>`,
    },
    {
      signalWhen: signalNolodashFaq.use(nolodashFaq => nolodashFaq.type === 'ready'),
      render: () => new MarkDown({
        signalContentHtml: signalNolodashFaq.use(nolodashFaq => nolodashFaq.value),
      }),
    },
  ])
}

function renderFilterBox({ signalFilterText }) {
  return html`
    <div class="filter-box">
      <div class="filter-box-inner">
        <input
          class="filter-box-input"
          type="text"
          placeholder="Search"
          ${set({
            oninput: e => signalFilterText.set(e.target.value),
            value: signalFilterText,
          })}
        />
        <object class="filter-box-icon" data="assets/search-icon.svg" type="image/svg+xml"></object>
      </div>
    </div>
  `;
}

function filterContent(pageContent, { signalPageHasFilterBox, signalFilterText }) {
  const signalNormalizedFilterText = Signal.use(
    [signalPageHasFilterBox, signalFilterText],
    (pageHasFilterBox, filterText) => {
      return (pageHasFilterBox ? filterText : '')
        .trim()
        .replace(/^_\.?/, '')
        .replace(/\(\s*\)?$/, '')
        .toLowerCase();
    },
  );

  return pageContent.map(categoryInfo => {
    const signalFilteredEntries = signalNormalizedFilterText.use(filterText => {
      return categoryInfo.entries.filter(entry => {
        return matchesViaFuzzySearch(filterText, entry.name.toLowerCase());
      });
    });
    return { ...categoryInfo, signalEntries: signalFilteredEntries };
  });
}

/** Checks if the search term `searchInput` would match against `target` when using
 * a fuzzy-search algorithm.
 * Pre-condition: Both inputs should be lower-cased and trimmed, if necessary.
 */
function matchesViaFuzzySearch(searchInput, target) {
  if (searchInput.length === 0) return true;

  let index = 0;
  for (const char of target) {
    if (searchInput[index] === char) {
      index++;
      if (index === searchInput.length) {
        return true;
      }
    }
  }

  return false;
}

function getStyles() {
  const FILTER_BOX_HEIGHT = 28;
  return `
    :host {
      display: block;
      margin: 50px auto 80px;
      width: 800px;
      position: relative;
      @media (max-width: 850px) {
        width: 90vw;
        margin-left: 5vw;
      }
    }

    .category-name {
      margin-bottom: 28px;
      margin-top: 35px;
      font-size: 1.55rem;
      background: #333;
      color: #eee;
      padding: 4px 8px 3px;
      display: inline-block;
    }

    .filter-box {
      display: flex;
      justify-content: center;
      margin-top: 55px;
      margin-bottom: 5px;
      font-size: 1rem;
    }

    .filter-box-inner {
      display: flex;
      flex-flow: row;
      padding: 4px;
      border: 1px solid black;
      &:focus-within {
        border: 2px solid #00a;
        padding: 3px;
      }
      @media (max-width: 400px) {
        flex: 1;
      }
    }

    .filter-box-input {
      height: ${FILTER_BOX_HEIGHT}px;
      font-size: 1rem;
      margin: 0;
      border: 0;
      outline: 0;
      width: 300px;
      @media (max-width: 400px) {
        width: unset;
        flex: 1;
      }
    }

    .filter-box-icon {
      display: inline-block;
      width: ${FILTER_BOX_HEIGHT}px;
      height: ${FILTER_BOX_HEIGHT}px;
      margin-top: 1px;
    }

    .no-results {
      display: inline-block;
      margin-top: 16px;
      color: #444;
    }
  `;
}
