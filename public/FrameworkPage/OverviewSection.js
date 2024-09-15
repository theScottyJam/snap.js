import { defineElement, html, set } from './snapFramework.js';

export const OverviewSection = defineElement('OverviewSection', () => {
  return html`
    <div class="overview-region">
      <p>
        Need to add some complex interactivity to a webpage, but don't wish to go all out with a large framework? Perhaps your small webpage doesn't even have the infrastructure to install third-party dependencies from NPM. The Snap Framework is a simple, hackable copy-paste solution that provides the same core features as larger frameworks, but without the weight or setup hassle.
      </p>
    </div>

    <style ${set({ textContent: style })}></style>
  `;
});

const style = `
  .overview-region {
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 3.5em;
  }

  @media screen and (max-width: 900px) {
    .overview-region {
      max-width: calc(100% - 120px);
    }
  }

  @media screen and (max-width: 700px) {
    .overview-region {
      max-width: calc(100% - 60px);
    }
  }
`;
