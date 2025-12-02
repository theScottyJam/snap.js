import { defineStyledElement } from '../shared.js';
import { html, renderChoice } from '../snapFramework.js';

export const OverviewSection = defineStyledElement('OverviewSection', getStyles, ({ signalOnLatestVersion }) => {
  return html`
    <div class="overview-region">
      ${renderChoice([{
        signalWhen: signalOnLatestVersion.use(onLatestVersion => !onLatestVersion),
        render: () => html`
          <div class="warning">
            <p>
              <p><strong>You are viewing the documentation for an older version of this framework.</strong></p>
              <p>If you are looking up docs for an existing project, great! Please proceed.</p>
              <p>If you are about to start a new project, consider <a href="#!/framework">switching to the latest version</a>.</p>
            </p>
          </div>
        `,
      }])}
      <p>
        Need to add some complex interactivity to a webpage, but don't wish to go all out with a large framework? Perhaps your small webpage doesn't even have the infrastructure to install third-party dependencies from NPM, or perhaps you have strict auditing requirements in your company and want to add a framework without having to audit a huge codebase. The Snap Framework is a minimal, hackable copy-paste solution that provides the same core features as larger frameworks, but without the weight or setup hassle.
      </p>
      <div class="notice">
        <p>
          <p><strong>You might not need this framework!</strong></p>
          <p>The goal of this framework is to support single page application development via components, reactivity, and templating, all through a minimal amount of transparent code. Do your own goals line up?</p>
          <ul>
            <li>Do you need it to be a single page application? If you're just looking for code-reuse, maybe you could get away with server-side rendering through any language - PHP, Python, etc.</li>
            <li>Do you really want or need transparent code - code that you can read and maintain yourself? There's other good lightweight options out there, such as <a href="https://preactjs.com/" rel="noreferrer">Preact</a>, that aren't additionally trying to make their code transparent.</li>
          </ul>
          <p>The point of this warning is that you might find the learning curve for this framework to be a little harder than others, and the debugging experience to be a little more difficult. But it does the job the best it can under these requirements.</p>
        </p>
      </div>
    </div>
  `;
});

function getStyles() {
  return `
    .overview-region {
      max-width: 750px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 56px;
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

    .warning {
      margin: 0px -16px;
      padding: 0px 16px;
      background: #fdd;
      border: 1px solid #800;
      border-radius: 4px;
    }

    .notice {
      margin: 0px -16px;
      padding: 0px 16px;
      background: #eef;
      border: 1px solid #44a;
      border-radius: 4px;
    }
  `;
}
