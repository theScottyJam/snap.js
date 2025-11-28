import { html, renderChoice, Signal } from '../snapFramework.js';
import { defineStyledElement } from '../shared.js';
import { Footer } from './Footer.js';
import { Header } from './Header/Header.js';
import { PrimaryNav } from './PrimaryNav.js';

export const Frame = defineStyledElement('Frame', getStyles, function ({ children, hideFooter, pageInfo }) {
  this.append(children);
  return html`
    ${new Header()}
    ${new PrimaryNav({ pageInfo })}
    <div class="children-container">
      <slot></slot>
    </div>
    ${renderChoice([{
      signalWhen: new Signal(!hideFooter),
      render: () => new Footer(),
    }])}
  `;
});

function getStyles() {
  return `
    :host {
      display: flex;
      flex-flow: column;
      min-height: 100vh;
    }

    .children-container {
      flex: 1;
    }
  `;
};
