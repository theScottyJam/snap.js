import { html, renderChoice, set, Signal, useCleanup } from '../snapFramework.js';
import { SourceViewerSection } from './SourceViewerSection.js';
import { FeatureShowcaseSection } from './FeatureShowcaseSection.js';
import { OverviewSection } from './OverviewSection.js';
import { WithTooltip } from './WithTooltip.js';
import { AdditionalInformationSection } from './AdditionalInformationSection.js';
import { defineStyledElement } from '../shared.js';
import { renderEach } from '../../framework/snapFramework-2.0.js';

// Whenever a new framework version comes out, this list needs to be updated.
// Search the project for §u5gEq for information on other changes that need to happen.
const frameworkVersions = [
  { version: '2.0', lineCount: 279 },
  { version: '1.0', lineCount: 195 },
];

export const FrameworkPage = defineStyledElement('FrameworkPage', getStyles, ({ pageInfo }) => {
  const signalVersion = useVersion(pageInfo);
  const signalSnapFrameworkText = new Signal(undefined);
  const signalLoading = new Signal(false);
  const signalLoadFailed = new Signal(false);

  const getTextResponse = resp => {
    if (!resp.ok) {
      throw new Error(`Failed to load a required resource - error code: ${resp.code}`);
    }
    return resp.text();
  };

  signalVersion.use(async version => {
    if (version === undefined) {
      return;
    }

    const abortController = new AbortController();
    useCleanup(() => abortController.abort());
    signalLoading.set(true);
    try {
      const [fullText, minifiedText] = await Promise.all([
        fetch(`framework/snapFramework-${version}.js`, { signal: abortController.signal })
          .then(getTextResponse),
        fetch(`framework/snapFramework-${version}.min.js`, { signal: abortController.signal })
          .then(getTextResponse),
      ]);

      const lineCount = frameworkVersions.find(verInfo => verInfo.version === version).lineCount;
      signalSnapFrameworkText.set({ fullText, minifiedText, version, lineCount });
    } catch (error) {
      if (error.name === 'AbortError') {
        // ignore it
      } else {
        signalLoadFailed.set(true);
        throw error;
      }
    } finally {
      signalLoading.set(false);
    }
  });

  return html`
    ${renderChoice([
      {
        signalWhen: signalVersion.use(version => version === undefined),
        render: () => html`
          <h1>Page not found</h1>
        `,
      },
      {
        signalWhen: signalSnapFrameworkText,
        // Using renderEach() to force the content to reload whenever the version number changes
        render: () => renderEach(
          signalSnapFrameworkText.use(textInfo => [[textInfo.version, textInfo]]),
          ({ fullText, minifiedText, lineCount }) => {
            return renderPageContents({ fullText, minifiedText, lineCount, signalLoading, signalVersion, pageInfo });
          },
        ),
      },
      {
        signalWhen: signalLoadFailed,
        render: renderLoadFailed,
      },
      {
        signalWhen: new Signal(true),
        render: renderLoading,
      },
    ])}
  `;
});

/** Returns an undefined signal if the route was bad. */
function useVersion(pageInfo) {
  return pageInfo.signalPage.use(route => {
    if (route === 'framework') {
      return frameworkVersions[0].version;
    }

    const parts = route.split('/');
    if (parts.length === 3 && parts[0] === 'framework' && parts[1] === 'release') {
      if (frameworkVersions.some(verInfo => verInfo.version === parts[2])) {
        const version = parts[2];
        if (parts[2] === frameworkVersions[0].version) {
          // Change the URL to simply /framework if they're viewing the latest version.
          window.history.replaceState({}, 'Title', '/#!/framework');
        }
        return version;
      }
    }

    return undefined;
  });
}

function renderLoading() {
  const signalOpacity = new Signal(0);

  const timeoutId = setTimeout(() => signalOpacity.set(1), 1000);
  useCleanup(() => clearTimeout(timeoutId));

  return html`
    <p class="loading" ${set({
      style: signalOpacity.use(opacity => `opacity: ${opacity}`),
    })}>
      Loading...
    </p>
  `;
}

function renderLoadFailed() {
  return html`
    <p class="load-failed">Failed to load page.</p>
  `;
}

function renderPageContents({ fullText, minifiedText, lineCount, signalLoading, signalVersion, pageInfo }) {
  const signalOnLatestVersion = signalVersion.use(version => version === frameworkVersions[0].version);
  const version = signalVersion.get(); // The whole component refreshes each time the version changes, so it's safe to just pull it out.
  return html`
    ${new OverviewSection({ signalOnLatestVersion })}
    <div style="height: 20px"></div>
    ${new FeatureShowcaseSection()}
    <h2 class="header has-section-description">— GRAB 'N GO —</h2>
    <p class="section-description">All ${renderTextWithTooltip(`${lineCount} lines`, 'Excluding whitespace and comments')} of code shown below are just a copy-paste away from being yours.</p>
    ${versionPicker({ signalLoading, signalVersion, pageInfo })}
    ${new SourceViewerSection({ fullText, minifiedText, signalOnLatestVersion, version })}
    ${renderChoice([{
      // These "additional guidelines" are kept up-to-date with the latest version of the framework,
      // so it doesn't make sense to show them on older versions, nor is it that important to do so.
      signalWhen: signalOnLatestVersion,
      render: () => html`
        <h2 class="header">— Additional Guidelines —</h2>
        ${new AdditionalInformationSection()}
      `,
    }])}
  `;
}

function versionPicker({ signalLoading, signalVersion, pageInfo }) {
  return html`
    <div class="version-picker-row">
      ${renderChoice([{
        signalWhen: signalLoading,
        render: () => html`<p class="inline-loading">Loading...</p>`,
      }])}
      <a class="changelog" href="https://github.com/theScottyJam/snap.js/blob/main/FRAMEWORK_CHANGELOG.md" rel="noreferrer">
        Changelog
      </a>
      <span class="divider-bullet">&bull;</span>
      <select class="version-picker" ${set({
        onchange: event => {
          pageInfo.setSignalPage('framework/release/' + event.target.value);
        },
      })}>
        ${renderEach(
          new Signal(frameworkVersions.map(verInfo => [verInfo.version, verInfo.version])),
          version => {
            return html`
              <option ${set({
                value: version,
                textContent: 'Version ' + version,
                selected: signalVersion.get() === version,
              })}>
              </option>
            `;
          },
        )}
      </select>
    </div>
  `;
}

function renderTextWithTooltip(text, tooltip) {
  return html`
    ${new WithTooltip({
      child: html`<span class="hoverable-text" ${set({ textContent: text })}></span>`,
      tooltip,
    })}
  `;
}

function getStyles() {
  return `
    .loading {
      color: #555;
      margin-left: 20px;
      transition: opacity 0.1s;
    }

    .load-failed {
      color: #a00;
      margin-left: 20px;
      font-weight: bold;
      letter-spacing: 0.08em;
    }

    .header {
      color: rgb(0, 41, 34);
      font-size: 1.4rem;
      text-align: center;
      letter-spacing: 0.2em;
      margin-top: 75px;
      margin-bottom: 36px;
      &.has-section-description {
        margin-bottom: 18px;
      }
    }

    .section-description {
      margin-top: 0;
      margin-bottom: 16px;
      margin-left: 8px;
      margin-right: 8px;
      text-align: center;
    }

    .hoverable-text {
      text-decoration: underline;
      text-decoration-style: dotted;
    }

    .version-picker-row {
      display: flex;
      justify-content: end;
      gap: 4px;
    }

    .inline-loading {
      margin: 0;
      align-self: center;
      color: #555;
      font-size: 0.8rem;
    }

    .version-picker {
      margin: 4px;
      border: unset;
      background: unset;
      cursor: pointer;
    }

    .changelog {
      font-size: 0.8rem;
      color: inherit;
      align-self: center;
    }

    .divider-bullet {
      font-size: 1.2rem;
      color: inherit;
      align-self: center;
      margin-left: 4px;
      margin-right: -2px;
    }
  `;
}
