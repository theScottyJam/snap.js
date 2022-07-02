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
        . All code samples presented are under the{' '}
        <a href="https://opensource.org/licenses/MIT" rel="noreferrer">
          MIT license
        </a>
        .
      </p>
    </footer>
  );
}
