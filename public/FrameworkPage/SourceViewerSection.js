/* eslint-disable react-hooks/rules-of-hooks */

import { defineElement, html, set } from './snapFramework.js';
import { CodeViewer } from './CodeViewer.js';
import { assert } from './util.js';

function doesLineHavePragma(line, pragma) {
  return line.match(/\/\/# *([a-zA-Z0-9_-]*)/)?.[1] === pragma;
}

class LineBuffer {
  #lines;
  #at = 0;
  constructor(lines) {
    this.#lines = lines;
  }

  /**
   * predicateMap is an object that maps predicate names to predicates
   * @returns `{ section: string[], stopReason: <name of predicate or "END"> }`
   */
  grabLinesUntil(predicateMap) {
    const startIndex = this.#at;
    let stopReason = 'END';
    mainLoop: for (; this.#at < this.#lines.length; this.#at++) {
      for (const [predicateName, predicate] of Object.entries(predicateMap)) {
        if (predicate(this.#lines[this.#at])) {
          stopReason = predicateName;
          break mainLoop;
        }
      }
    }

    return {
      section: this.#lines.slice(startIndex, this.#at),
      stopReason,
    };
  }

  /**
   * Same as grabLinesUntil(), but once the matching line is found, it'll advance past it.
   * The skipped line won't be returned in the sections property.
   */
  grabLinesUntilPast(predicateMap) {
    const result = this.grabLinesUntil(predicateMap);
    if (result.stopReason !== 'END') {
      this.next();
    }
    return result;
  }

  currentLine() {
    return this.#lines[this.#at];
  }

  next() {
    if (!this.atEnd()) {
      this.#at++;
    }
  }

  atEnd() {
    return this.#lines.length === this.#at;
  }
}

export const SourceViewerSection = defineElement('SourceViewerSection', sourceCode => {
  return html`
    <div class="content">
      ${renderFrameworkSourceViewerContent(sourceCode)}
    </div>

    <style ${set({ textContent: style })}></style>
  `;
});

const isSectionHeading = line => line.match(/=====+ (.*) =====+/)?.[1]; // If matches, returns the section heading text
const skipWhitespaceLines = lineBuffer => {
  while (lineBuffer.currentLine()?.match(/^ *$/)) {
    lineBuffer.next();
  }
};

export function renderFrameworkSourceViewerContent(sourceCode) {
  const lineBuffer = new LineBuffer(sourceCode.split('\n'));
  const isStartPragma = line => doesLineHavePragma(line, 'START');
  const hasClosingCommentToken = line => line.includes('*/');

  // Jump to `//# START` pragma
  lineBuffer.grabLinesUntilPast({ isStartPragma });

  const contentNode = document.createDocumentFragment();
  let inTopLevelJsDocs = false;
  let lineNumb = 1;
  while (!lineBuffer.atEnd()) {
    if (!inTopLevelJsDocs) {
      const { lines, stopReason } = gatherCodeLines({ lineBuffer, lineNumb })
      if (lines.length > 0) {
        contentNode.append(html`
          <div class="code-viewer">
            ${new CodeViewer(lines.join('\n'), { theme: 'dark', lineNumb })}
          </div>
        `);
      }
      lineNumb += lines.length;
      if (stopReason === 'isTopLevelOpeningJsDocToken') {
        inTopLevelJsDocs = true;
        lineBuffer.next(); // Go past opening comment
      }
      if (stopReason === 'isSectionHeading') {
        const sectionHeaderText = isSectionHeading(lineBuffer.currentLine());
        contentNode.append(renderSectionHeader(sectionHeaderText));
        lineBuffer.next(); // Go past section header
        skipWhitespaceLines(lineBuffer);
      }
    } else {
      const { section, stopReason } = lineBuffer.grabLinesUntilPast({ hasClosingCommentToken });
      assert(stopReason !== 'END');
      contentNode.append(renderJsDocs({ lines: section, lineBeingAnnotated: lineBuffer.currentLine() }));
      inTopLevelJsDocs = false;
    }
  }

  return contentNode;
}

function gatherCodeLines({ lineBuffer }) {
  const isBlankLine = line => line.match(/^ *$/);
  const isTopLevelOpeningJsDocToken = line => line === '/**';
  const isHiddenLine = line => doesLineHavePragma(line, 'HIDE-NEXT');

  let lines = [];
  while (true) {
    const { section, stopReason } = lineBuffer.grabLinesUntil({ isTopLevelOpeningJsDocToken, isSectionHeading, isHiddenLine });
    lines.push(...section);

    if (stopReason === 'isHiddenLine') {
      lineBuffer.next(); // Skip the line with the pragma
      lineBuffer.next(); // Skip the line that is supposed to be hidden
      skipWhitespaceLines(lineBuffer);
      continue;
    }

    if (lines.length > 0 && isBlankLine(lines.at(-1))) {
      lines.pop();
    }

    return { lines, stopReason };
  }
}

function renderSectionHeader(headerText) {
  return html`
    <h1 class="section-header" ${set({ textContent: headerText })}>
    </h1>
  `;
}

function renderJsDocs({ lines: lines_, lineBeingAnnotated }) {
  const stripStarFromLine = line => line.replace(/^ *\* ?/, '');
  const lines = lines_.map(line => stripStarFromLine(line));

  const lineBuffer = new LineBuffer(lines);
  const isBlankLine = line => line.match(/^ *$/);
  const isStartOfExample = line => line.includes('@example');
  const isCollapseExamplesPragma = line => doesLineHavePragma(line, 'COLLAPSE-EXAMPLES');
  
  const contentNode = document.createDocumentFragment();
  const lineBeingAnnotatedMatch = lineBeingAnnotated.match(/(class|function) ([a-zA-Z0-9]+)/);
  if (lineBeingAnnotatedMatch) {
    contentNode.append(html`
      <h2>
        <span class="jsdoc-header-label" ${set({ textContent: lineBeingAnnotatedMatch[1] })}></span>
        <span class="jsdoc-header" ${set({ textContent: lineBeingAnnotatedMatch[2] })}></span>
        ${
          lineBeingAnnotatedMatch[1] === 'function'
            ? html`
                <span class="jsdoc-header-label" style="margin-left: -4px">()</span>
              `
            : html``
        }
      </h2>
    `);
  }

  while (!lineBuffer.atEnd()) {
    const { section, stopReason } = lineBuffer.grabLinesUntil({ isBlankLine, isStartOfExample, isCollapseExamplesPragma });
    if (section.length > 0) {
      contentNode.append(html`
        <p>
          ${renderExtractedJsDescriptionText(section.join('\n'))}
        </p>
      `);
    }
    if (stopReason === 'isStartOfExample' || stopReason === 'isCollapseExamplesPragma') {
      contentNode.append(renderJsDocsExamples(lineBuffer));
      break;
    }
    lineBuffer.next(); // Move past blank line or `@example` line.
  }

  return html`
    <div class="explanation">
      ${contentNode}
    </div>
  `;
}

/**
 * pre-condition: The "lineBuffer" should only contain lines that deal with jsdocs examples,
 *   and those lines should already have the "*" stripped from the beginning of each line.
 */
function renderJsDocsExamples(lineBuffer) {
  const isStartOfExample = line => line.includes('@example');
  const isCollapseExamplesPragma = line => doesLineHavePragma(line, 'COLLAPSE-EXAMPLES');
  const extractExampleName = line => line.match(/<caption>(.*)<\/caption>/)?.[1];
  
  const contentNode = document.createDocumentFragment();

  let currentExampleDescription; // Set to the current example's description, or undefined if it doesn't have one.
  let collapseExamples = false;
  while (!lineBuffer.atEnd()) {
    const { section, stopReason } = lineBuffer.grabLinesUntil({ isStartOfExample, isCollapseExamplesPragma });
    if (stopReason === 'isCollapseExamplesPragma') {
      lineBuffer.next(); // Skip past the pragma
      // The pragma can only be placed directly before '@example'.
      assert(isStartOfExample(lineBuffer.currentLine()));
    }

    if (section.length > 0) {
      const codeViewerEl = new CodeViewer(section.join('\n'), { theme: 'light' });
      if (!collapseExamples) {
        contentNode.append(html`
          ${
            currentExampleDescription === undefined
              ? html``
              : html`<h2 class="example-header" ${set({ textContent: currentExampleDescription })}></h2>`
          }
          ${codeViewerEl}
        `);
      } else {
        assert(currentExampleDescription !== undefined, 'An example description is required for collapsed examples.');
        contentNode.append(html`
          <details>
            <summary ${set({ textContent: 'Example: ' + currentExampleDescription })}></summary>
            ${codeViewerEl}
          </details>
        `);
      }
    }

    if (stopReason === 'isCollapseExamplesPragma') {
      collapseExamples = true;
    }
    if (stopReason === 'isStartOfExample' || stopReason === 'isCollapseExamplesPragma') {
      currentExampleDescription = extractExampleName(lineBuffer.currentLine()) ?? undefined;
    }
    lineBuffer.next(); // Move past the `@example` line.
  }

  return contentNode;
}

/** Renders just the description text from a js-doc comment. Examples should already be removed from the string. */
function renderExtractedJsDescriptionText(text) {
  const linkPattern = /\{@link (.*)}/g;
  const contentNode = document.createDocumentFragment();
  while (true) {
    const startIndex = linkPattern.lastIndex;
    const linkMatch = linkPattern.exec(text);
    const textSlice = text.slice(startIndex, linkMatch?.index ?? undefined);
    contentNode.append(document.createTextNode(textSlice));

    if (linkMatch) {
      linkPattern.lastIndex = linkMatch.index + linkMatch[0].length;
      const linkText = linkMatch[1];
      contentNode.append(html`
        <a href="javascript:void(0)" ${set({ textContent: linkText })}></a>
      `);
    } else {
      break;
    }
  }

  return contentNode;
}

const CODE_BACKGROUND_COLOR = '#272822';

const positionInCenterMixin = selector => `
  ${selector} {
    margin-left: auto;
    margin-right: auto;
    width: 900px;
  }
`;

const style = `
  :host {
    display: block;
  }

  .jsdoc-header-label {
    color: #888;
  }

  .jsdoc-header {
    color: #333;
  }

  .section-header {
    color: white;
    font-size: 1.5rem;
  }
  ${positionInCenterMixin('.section-header')}

  ${positionInCenterMixin('.code-viewer')}

  .content {
    background: ${CODE_BACKGROUND_COLOR};
    padding-top: 20px;
    padding-bottom: 20px;
    box-shadow: 0 -6px 2px -4px rgba(0,0,0,0.15) inset;
  }

  .explanation {
    margin-top: 10px;
    margin-bottom: 10px;
    background: white;
    padding: 30px;
  }
  ${positionInCenterMixin('.explanation')}

  .example-header {
    font-size: 1rem;
  }

  details {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  
  details ${customElements.getName(CodeViewer)} {
    display: block;
    margin-top: 0.5em;
    margin-bottom: 1.5em;
  }
`;
