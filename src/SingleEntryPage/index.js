import Code from './Code';
import Description from './Description';
import style from './index.style';
import {
  lookupContentEntryFromRoute,
  extractUtilityPageTypeFromRoute,
} from '../shared';

export default function SingleEntryPage({ page, setPage, content }) {
  const pageData = lookupContentEntryFromRoute(content, page);
  if (pageData === null) {
    return <NotFound setPage={setPage} page={page} />;
  }

  const topLevelPage = extractUtilityPageTypeFromRoute(page);
  if (topLevelPage === 'nolodash') {
    return (
      <NolodashSingleEntryPage
        pageData={pageData}
        page={page}
        setPage={setPage}
      />
    );
  } else {
    return (
      <DefaultSingleEntryPage
        pageData={pageData}
        page={page}
        setPage={setPage}
      />
    );
  }
}

function DefaultSingleEntryPage({ pageData, setPage, page }) {
  const { name, src, description } = pageData;
  const { summary } = pageData.manifest;
  return (
    <div>
      <BackButton setPage={setPage} page={page} />
      <h1 className={style.entryHeader}>{name}()</h1>
      {pageData.hidden && <UnlistedWarning />}
      {src && <Code src={src} />}
      <Description summary={summary} description={description} />
    </div>
  );
}

function NolodashSingleEntryPage({ pageData, setPage, page }) {
  const { src, description } = pageData;
  const { summary, lodashLink } = pageData.manifest;
  return (
    <div>
      <BackButton setPage={setPage} page={page} />
      <h1 className={style.entryHeader}>Lodash's version</h1>
      <a className={style.fnSignatureLink} href={lodashLink}>
        <code>{pageData.manifest.fnSignature}</code>
      </a>
      {src && <Code src={src} />}
      <Description
        summary={summary}
        description={'# Plain JavaScript\n\n' + description}
      />
    </div>
  );
}

function NotFound({ setPage, page }) {
  return (
    <div>
      <BackButton setPage={setPage} page={page} />
      <h1>Page not found</h1>
    </div>
  );
}

function BackButton({ setPage, page }) {
  const path = extractUtilityPageTypeFromRoute(page) ?? 'utils';
  return (
    <a
      href={'#!/' + path}
      className={style.backButton}
      onClick={() => setPage(path)}
    >
      Back to Overview
    </a>
  );
}

function UnlistedWarning() {
  return (
    <div class={style.unlisted}>
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
  );
}
