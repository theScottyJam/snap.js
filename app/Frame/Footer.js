import { html } from '../snapFramework.js';
import { defineStyledElement } from '../shared.js';

export const Footer = defineStyledElement('Footer', getStyles, () => {
  return html`
    <footer>
      <p class="footer-text">
        Bugs? Suggestions? Please file an issue on
        <a
          href="https://github.com/theScottyJam/snap.js/issues"
          rel="noreferrer"
        >Github</a>.

        <br class="break-when-small" />

        All code presented is under
        <a
          href="https://github.com/theScottyJam/snap.js/blob/main/LICENSE"
          rel="noreferrer"
        >the "unlicense" license</a>
      </p>
    </footer>
  `;
});

function getStyles() {
  return `
    :host {
      width: 100%;
      background: #325d56;
      box-shadow: 0 15px 15px -15px rgba(0, 0, 0, 0.25) inset;
    }

    /* Only exists for semantic HTML purposes */
    footer {
      display: contents;
    }
    
    .footer-text {
      font-size: 0.75rem;
      margin: 0;
      margin-right: 8px;
      padding: 6px 8px;
      text-align: right;
      line-height: 1.4em;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.95);
      & a {
        color: inherit;
      }
      @media (max-width: 750px) {
        text-align: left;
      }
    }
    
    .break-when-small {
      display: none;
      @media (max-width: 750px) {
        display: unset;
      }
    }
  `;
}
