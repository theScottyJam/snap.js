import React from 'react';
import style from './Content.style';
import DocEntry from '../DocEntry';
import { extractTopLevelPageFromRoute } from '../../shared';
import { ReactComponent as SearchIcon } from './searchIcon.svg';
import MarkDown from '../../MarkDown/MarkDown.js';
import { nolodashFaq } from './nolodashFaq.js';

export default function Content({ page, setPage, content }) {
  const [filterText, setFilterText] = React.useState('');
  const topLevelPage = extractTopLevelPageFromRoute(page);
  if (topLevelPage === null) {
    throw new Error('Invalid route');
  }

  const doesPageHaveFilterBox = topLevelPage === 'nolodash';

  const filteredPageContent = doesPageHaveFilterBox
    ? filterContent(content[topLevelPage], filterText)
    : content[topLevelPage];

  return (
    <div className={style.content}>
      <PageSummary topLevelPage={topLevelPage} />
      {doesPageHaveFilterBox && (
        <FilterBox filterText={filterText} setFilterText={setFilterText} />
      )}
      {filteredPageContent.length === 0 && content[topLevelPage].length > 0 && (
        <i className={style.noResults}>No Results</i>
      )}
      {filteredPageContent.map(({ categoryHeading, entries }) => (
        <Category
          key={categoryHeading}
          heading={categoryHeading}
          entries={entries}
          page={page}
          setPage={setPage}
        />
      ))}
    </div>
  );
}

function Category({ heading, entries, page, setPage }) {
  return (
    <>
      <h1 className={style.categoryName}>{heading}</h1>
      {entries.map(entry => (
        <DocEntry
          key={entry.name}
          entry={entry}
          page={page}
          setPage={setPage}
        />
      ))}
    </>
  );
}

function PageSummary({ topLevelPage }) {
  if (topLevelPage === 'utils') {
    return (
      <>
        <h2>Simple Utilities</h2>
        <p>
          These are a handful of various copy-paste-friendly utility functions,
          that are ready to be mixed into any project that might need them.
        </p>
      </>
    );
  } else if (topLevelPage === 'nolodash') {
    return (
      <>
        <h2>Lodash Replacements</h2>
        <p>
          This is intended to be a complete catalog of all the functions that{' '}
          <a href="https://lodash.com">Lodash</a> provides, along with a
          description of how one would go about doing the same thing in plain
          JavaScript.
        </p>
        <p>
          If you ever see in any of the examples a built-in function that you
          wish to learn more about, please search{' '}
          <a href="https://developer.mozilla.org/en-US/">MDN</a> for an in-depth
          explanation about that particular function.
        </p>
        <p>
          This page is still a work-in-progress. Additional entries are
          constantly being added to this page. If you see any issues on any of
          the existing entries, or if you have any suggestions for improvement,
          please{' '}
          <a href="https://github.com/theScottyJam/snap.js/issues">
            open an issue on GitHub
          </a>
          .
        </p>
        <details>
          <summary>
            <strong>FAQ</strong>
          </summary>
          <MarkDown>{nolodashFaq}</MarkDown>
        </details>
      </>
    );
  } else {
    return null;
  }
}

function FilterBox({ filterText, setFilterText }) {
  return (
    <div className={style.filterBox}>
      <div className={style.filterBoxInner}>
        <input
          className={style.filterBoxInput}
          type="text"
          onChange={e => setFilterText(e.target.value)}
          value={filterText}
          placeholder="Search"
        />
        <SearchIcon className={style.filterBoxIcon} viewBox="0 0 50 50" />
      </div>
    </div>
  );
}

function filterContent(pageContent, filterText) {
  filterText = filterText
    .trim()
    .replace(/^_\.?/, '')
    .replace(/\(\s*\)?$/, '')
    .toLowerCase();

  // Bit of performance gain if there is no filter text in the box. Probably unnecessary.
  if (filterText === '') return pageContent;

  return pageContent.flatMap(categoryInfo => {
    const filteredEntries = categoryInfo.entries.filter(entry =>
      matchesViaFuzzySearch(filterText, entry.name.toLowerCase())
    );
    return filteredEntries.length > 0
      ? [{ ...categoryInfo, entries: filteredEntries }]
      : [];
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
