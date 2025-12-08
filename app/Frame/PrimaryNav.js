import { html, set } from '../snapFramework.js';
import { classNameBuilder, defineStyledElement } from '../shared.js';

export const PrimaryNav = defineStyledElement('PrimaryNav', getStyles, ({ pageInfo }) => {
  return html`
    ${renderLink({ target: 'utils', textContent: 'Simple Utilities', pageInfo })}
    ${renderLink({ target: 'nolodash', textContent: 'Lodash Replacements', pageInfo })}
    ${renderLink({ target: 'seams', textContent: 'Test Seams', pageInfo })}
    ${renderLink({ target: 'framework', textContent: 'Snap Framework', pageInfo })}
  `;
});

function renderLink({ target, textContent, pageInfo }) {
  const { signalPage, setSignalPage } = pageInfo;

  return html`
    <a ${set({
      href: '#!/' + target,
      textContent,
      onclick: () => setSignalPage(target),
      className: classNameBuilder({
        link: true,
        active: signalPage.use(page => page.startsWith(target)),
      }),
    })}></a>
  `;
}

export function getStyles() {
  return `
    :host {
      padding-top: 12px;
      padding-left: 6px;
      padding-bottom: 12px;
      display: flex;
      @media screen and (max-width: 40rem) {
        flex-flow: column;
        gap: 12px;
        background: #eee;
        text-align: center;
        box-shadow: 0 -10px 10px -10px rgba(0, 0, 0, 0.1) inset;
      }
    }

    .link {
      display: inline-block;
      border: none;
      background: none;
      font-size: 0.9rem;
      padding: 1px 6px;
      margin: 0px 6px;
      letter-spacing: 0.1em;
      font-weight: bold;

      cursor: default;
      color: #00302d;
      text-decoration: none;

      &.active {
        pointer-events: none;
      }

      &:not(.active) {
        cursor: pointer;
        color: black;
        text-decoration: underline;
      }
    }
  `;
}
