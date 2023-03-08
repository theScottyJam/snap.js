import React from 'react';
import style from './PrimaryNav.style';

export default function PrimaryNav({ page, setPage }) {
  return (
    <div className={style.primaryNav}>
      <Link page={page} setPage={setPage} target="utils">
        Simple Utilities
      </Link>
      <Link page={page} setPage={setPage} target="nolodash">
        Lodash Replacements
      </Link>
    </div>
  );
}

function Link({ children, page, target, setPage }) {
  return (
    <a
      href={'#!/' + target}
      onClick={() => setPage(target)}
      className={style.link({ active: page.startsWith(target) })}
    >
      {children}
    </a>
  );
}
