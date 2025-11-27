import { html } from '../../snapFramework.js';
import { defineStyledElement } from '../../shared.js';
import { BackgroundDecor } from './BackgroundDecor.js';

export const Header = defineStyledElement('Header', getStyles, () => {
  return html`
    <header>
      ${new BackgroundDecor()}
      <img class="logo" src="assets/expanded-logo.svg" alt="Snap.js">
      <h3 class="subheading">The Copy-Paste Library</h3>
    </header>
  `;
});

function getStyles () {
  return `
    :host {
      display: block;
      width: 100%;
      height: 160px;
      background: radial-gradient(
        circle,
        rgba(0, 140, 140, 1) 0%,
        rgba(0, 106, 89, 1) 100%
      );
      position: relative; /* Makes overflow work properly */
      overflow: hidden;
      box-shadow: 0 -15px 15px -15px rgba(0, 0, 0, 0.15) inset;
    }

    /* Only here for semantic-HTML purposes. */
    header {
      display: contents;
    }

    .logo {
      display: block;
      margin: 0 auto;
      margin-top: 18px;
      position: relative; /* Puts it in front of background decor */
    }

    .subheading {
      font-size: 1rem;
      text-align: center;
      margin: 0;
      margin-top: 7px;
      letter-spacing: 0.106rem;
      color: rgba(150, 220, 255, 1);
      position: relative; /* Puts it in front of background decor */
    }
  `;
}
