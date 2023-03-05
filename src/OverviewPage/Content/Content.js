import React from 'react';
import style from './Content.style';
import DocEntry from '../DocEntry';
import { extractTopLevelPageFromRoute } from '../../shared';

export default function Content({ page, setPage, content }) {
  let topLevelPage = extractTopLevelPageFromRoute(page);
  if (topLevelPage === null) {
    throw new Error('Invalid route');
  }

  return (
    <div className={style.content}>
      <PageSummary topLevelPage={topLevelPage} />
      {content[topLevelPage].map(({ categoryHeading, entries }) => (
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
          description of how one would go about doing the same thing in vanilla
          JavaScript.
        </p>
        <p>
          If you ever see, in any of the examples, a built-in function that you
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
      </>
    );
  } else {
    return null;
  }
}
