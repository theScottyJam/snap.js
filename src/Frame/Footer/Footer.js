import style from './Footer.style';

export default function Footer() {
  return (
    <footer className={style.footer}>
      <p className={style.footerText}>
        Bugs? Suggestions? Please file an issue on{' '}
        <a
          href="https://github.com/theScottyJam/snap.js/issues"
          rel="noreferrer"
        >
          Github
        </a>
        .<br className={style.breakWhenSmall} /> All code presented is under{' '}
        <a
          href="https://github.com/theScottyJam/snap.js/blob/main/LICENSE"
          rel="noreferrer"
        >
          the "unlicense" license
        </a>
        .
      </p>
    </footer>
  );
}
