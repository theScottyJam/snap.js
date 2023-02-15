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
