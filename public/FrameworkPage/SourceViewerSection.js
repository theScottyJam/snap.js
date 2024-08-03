/* eslint-disable react-hooks/rules-of-hooks */

import { defineElement, html, renderChoice, renderEach, set, Signal, useSignals } from './snapFramework.js';
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

export const SourceViewerSection = defineElement('SourceViewerSection', ({ fullText, minifiedText }) => {
  const documentedCodeRef = new Signal(undefined);
  const viewMode$ = new Signal('normal'); // Values can be 'normal' or 'minified'.
  return html`
    ${renderControls({
      documentedCodeRef,
      viewMode$,
      updateViewMode: newViewMode => viewMode$.set(newViewMode),
    })}
    <div class="documented-code" ${el => documentedCodeRef.set(el)}>
      ${renderChoice([
        {
          when$: useSignals([viewMode$], viewMode => viewMode === 'normal'),
          render: () => renderFrameworkSourceViewerContent({ fullText, minifiedText, viewMode: viewMode$.get() }),
        },
        {
          when$: useSignals([viewMode$], viewMode => viewMode === 'minified'),
          render: () => renderFrameworkSourceViewerContent({ fullText, minifiedText, viewMode: viewMode$.get() }),
        },
      ])}
    </div>

    <style ${set({ textContent: style })}></style>
  `;
});

function renderControls({ documentedCodeRef, viewMode$, updateViewMode }) {
  return html`
    <div class="code-controls-container">
      <div></div> <!-- empty space to fill the left side -->
      <div class="code-controls">
        <div class="view-mode-buttons" style="display: none">
          <button class="view-mode-button" ${set({
            onclick: () => updateViewMode('normal'),
            disabled: useSignals([viewMode$], viewMode => viewMode === 'normal'),
          })}>
            Original
          </button>
          <button class="view-mode-button" ${set({
            onclick: () => updateViewMode('minified'),
            disabled: useSignals([viewMode$], viewMode => viewMode === 'minified'),
          })}>
            Minified
          </button>
        </div>
        <button class="select-all" ${set({
          onclick: () => {
            const selection = window.getSelection();
            const range = document.createRange();
            const firstCodeBlock = documentedCodeRef.get().querySelector(':nth-child(1 of .code-viewer)');
            range.setStartBefore(firstCodeBlock);
            const lastCodeBlock = documentedCodeRef.get().querySelector('.code-viewer:last-child');
            range.setEndAfter(lastCodeBlock);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        })}>
          Select all
        </button>
      </div>
    </div>
  `;
}

const isSectionHeading = line => line.match(/=====+ (.*) =====+/)?.[1]; // If matches, returns the section heading text
const hasBulletPoint = line => line.match(/^ *\* ?(.*)/)?.[1]; // If matches, returns the text without the bullet point
const hasParamAnnotation = line => line.match(/^ *@param ([a-zA-Z0-9_$]+) (.*)/)?.slice(1); // If matches, returns the [paramName, description text]
const skipWhitespaceLines = lineBuffer => {
  while (lineBuffer.currentLine()?.match(/^ *$/)) {
    lineBuffer.next();
  }
};

export function renderFrameworkSourceViewerContent({ fullText, minifiedText, viewMode }) {
  const lineBuffer = new LineBuffer(fullText.split('\n'));
  const isBlankLine = line => line.match(/^ *$/);
  const isNotBlankLine = line => !line.match(/^ *$/);
  const isStartPragma = line => doesLineHavePragma(line, 'START');
  const hasClosingCommentToken = line => line.includes('*/');

  // Jump to `//# START` pragma
  lineBuffer.grabLinesUntilPast({ isStartPragma });

  const docNodes = [];
  const codeNodes = [];
  let renderJsDocsNode = undefined;
  let inTopLevelJsDocs = false;
  let order = 0;
  while (!lineBuffer.atEnd()) {
    if (!inTopLevelJsDocs) {
      let { lines, stopReason } = gatherCodeLines({ lineBuffer })
      if (!lines.every(line => isBlankLine(line))) {
        const explanationOrder = order++;
        docNodes.push(renderJsDocsNode
          ? renderJsDocsNode(order++)
          : html`<div class="explanation" ${set({ style: `order: ${explanationOrder}` })}></div>`
        );

        let additionalCodeViewerStyle = '';
        if (viewMode === 'minified') {
          lines = [];
        }
        codeNodes.push(html`
          <div class="code-viewer" ${set({
            style: `order: ${order++}${additionalCodeViewerStyle}`
          })}>
            ${new CodeViewer(lines.join('\n') + '\n', { theme: 'dark' })}
          </div>
        `);
        renderJsDocsNode = undefined;
      } else {
        assert(renderJsDocsNode === undefined, 'A jsdoc node was created, but we failed to find a spot to place it.');
      }
      if (stopReason === 'isTopLevelOpeningJsDocToken') {
        inTopLevelJsDocs = true;
        lineBuffer.next(); // Go past opening comment
      }
      if (stopReason === 'isSectionHeading') {
        const rawSectionHeaderText = lineBuffer.currentLine();
        const sectionHeaderText = isSectionHeading(rawSectionHeaderText);

        lineBuffer.next(); // Go past section header
        const { section } = lineBuffer.grabLinesUntil({ isNotBlankLine });

        docNodes.push(html`
          <h1 class="section-header" ${set({
            textContent: '— ' + sectionHeaderText + ' —',
            style: `order: ${order++}`,
          })}></h1>
        `);
        codeNodes.push(html`
          <div class="code-viewer" ${set({ style: `order: ${order++}` })}>
            ${new CodeViewer([rawSectionHeaderText, ...section].join('\n') + '\n', { theme: 'dark' })}
          </div>
        `);
      }
    } else {
      const { section, stopReason } = lineBuffer.grabLinesUntilPast({ hasClosingCommentToken });
      assert(stopReason !== 'END');
      assert(renderJsDocsNode === undefined, 'two top-level js-doc comments were found in a row, and the webpage is not programmed to know how to render that.');
      const lineBeingAnnotated = lineBuffer.currentLine();
      renderJsDocsNode = order => renderJsDocs({ lines: section, lineBeingAnnotated, order });
      inTopLevelJsDocs = false;
    }
  }

  assert(renderJsDocsNode === undefined, 'A jsdoc node was created, but we failed to find a spot to place it.');

  const allNodes = document.createDocumentFragment();
  allNodes.append(
    ...docNodes,
    ...codeNodes,
  );
  if (viewMode === 'minified') {
    allNodes.append(html`
      <div class="code-viewer" ${set({
        style: `order: ${order++}`
      })}>
        ${new CodeViewer(minifiedText, { theme: 'dark' })}
      </div>
    `);
  }
  return allNodes;
}

function gatherCodeLines({ lineBuffer }) {
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

    return { lines, stopReason };
  }
}

function renderJsDocs({ lines: lines_, lineBeingAnnotated, order }) {
  const stripStarFromLine = line => line.replace(/^ *\* ?/, '');
  const lines = lines_.map(line => stripStarFromLine(line));

  const lineBuffer = new LineBuffer(lines);
  const isBlankLine = line => line.match(/^ *$/);
  const isStartOfExample = line => line.includes('@example');
  const isCollapseExamplesPragma = line => doesLineHavePragma(line, 'COLLAPSE-EXAMPLES');
  
  const contentNode = document.createDocumentFragment();

  const lineBeingAnnotatedMatch = lineBeingAnnotated.match(/(class|function) ([a-zA-Z0-9]+)/);
  let whatIsBeingDocumented = undefined;
  if (lineBeingAnnotatedMatch) {
    whatIsBeingDocumented = { type: lineBeingAnnotatedMatch[1], name: lineBeingAnnotatedMatch[2] }
  } else {
    const match = lineBeingAnnotated.match(/const ([a-zA-Z0-9]+) = \(.*\) =>/);
    if (match) {
      whatIsBeingDocumented = { type: 'function', name: match[1] };
    }
  }

  if (whatIsBeingDocumented) {
    contentNode.append(html`
      <h2 class="jsdoc-header">
        <span class="jsdoc-header-label" ${set({ textContent: whatIsBeingDocumented.type })}></span>
        <span class="jsdoc-header-entity-name" ${set({ textContent: whatIsBeingDocumented.name })}></span>
        ${
          whatIsBeingDocumented.type === 'function'
            ? html`
                <span class="jsdoc-header-label" style="margin-left: -4px">()</span>
              `
            : html``
        }
      </h2>
    `);
  }

  while (!lineBuffer.atEnd()) {
    const { section, stopReason } = lineBuffer.grabLinesUntil({
      isBlankLine,
      isStartOfExample,
      isCollapseExamplesPragma,
      hasBulletPoint,
      hasParamAnnotation,
    });

    if (section.length > 0) {
      contentNode.append(html`
        <p>
          ${renderExtractedJsDescriptionText(section.join('\n'))}
        </p>
      `);
    }
    if (stopReason === 'hasBulletPoint') {
      contentNode.append(renderBulletPointList(lineBuffer));
    } else if (stopReason === 'hasParamAnnotation') {
      contentNode.append(renderParamList(lineBuffer));
    } else if (stopReason === 'isStartOfExample' || stopReason === 'isCollapseExamplesPragma') {
      contentNode.append(renderJsDocsExamples(lineBuffer));
      break;
    }
    lineBuffer.next(); // Move past blank line or `@example` line.
  }

  return html`
    <div class="explanation" ${set({ style: `order: ${order}` })}>
      ${contentNode}
    </div>
  `;
}

/**
 * Renders a bullet point list from js-doc comments
 * 
 * pre-condition: The "lineBuffer" should only contain lines that deal with jsdocs examples,
 *   and those lines should already have the "*" stripped from the beginning of each line.
 */
function renderBulletPointList(lineBuffer) {
  const bulletPoints = [];

  // A multi-line bullet point will typically look like this:
  // /** description
  //  * * point 1
  //  *   more info about point 1
  //  * * point 2
  //
  // Note the triple space that exists on the continuation line.
  // This is what we use to decide if the line should be
  // treated as a continuation or not.
  const isBulletPointContinuationLine = line => line.match(/^ {3}/);

  while (!lineBuffer.atEnd()) {
    const currentLine = lineBuffer.currentLine();
    let bulletedText = hasBulletPoint(currentLine);
    if (bulletedText !== undefined) {
      bulletPoints.push(bulletedText);
    } else if (isBulletPointContinuationLine(currentLine)) {
      bulletPoints[bulletPoints.length - 1] += ' ' + currentLine.trim();
    } else {
      break;
    }
    lineBuffer.next();
  }

  return html`
    <ul>
      ${renderEach(
        Signal.from(bulletPoints.map((bulletedText, i) => [i, bulletedText])),
        bulletedText => {
          return html`<li>${renderExtractedJsDescriptionText(bulletedText)}</ul>`
        },
      )}
    </ul>
  `;
}

/**
 * Renders a param list from js-doc comments
 * 
 * pre-condition: The "lineBuffer" should only contain lines that deal with jsdocs examples,
 *   and those lines should already have the "*" stripped from the beginning of each line.
 */
function renderParamList(lineBuffer) {
  const paramDescriptions = [];

  // A multi-line param will typically look like this:
  // /** description
  //  * @param param1 some description
  //  *   more info about param1
  //  * @param param2 some description
  //
  // Note the triple space that exists on the continuation line.
  // This is what we use to decide if the line should be
  // treated as a continuation or not.
  const isParamContinuationLine = line => line.match(/^ {3}/);

  while (!lineBuffer.atEnd()) {
    const currentLine = lineBuffer.currentLine();
    let paramAnnotationInfo = hasParamAnnotation(currentLine);
    if (paramAnnotationInfo !== undefined) {
      paramDescriptions.push({ name: paramAnnotationInfo[0], description: paramAnnotationInfo[1] });
    } else if (isParamContinuationLine(currentLine)) {
      paramDescriptions[paramDescriptions.length - 1].description += ' ' + currentLine.trim();
    } else {
      break;
    }
    lineBuffer.next();
  }

  return html`
    <p><strong>Parameters:</strong></p>
    <ul>
      ${renderEach(
        Signal.from(paramDescriptions.map((paramInfo, i) => [i, paramInfo])),
        ({ name, description }) => {
          return html`
            <li>
              <strong ${set({ textContent: name + ': ' })}></strong>
              <span>${renderExtractedJsDescriptionText(description)}</span>
            </ul>
          `;
        },
      )}
    </ul>
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
      const codeViewerEl = html`
        <div class="example">
          ${new CodeViewer(section.join('\n'), { theme: 'light' })}
        </div>
      `;
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
  const contentNode = document.createDocumentFragment();
  if (text.startsWith('@returns')) {
    contentNode.append(html`<strong>Returns </strong>`);
    text = text.slice('@returns'.length);
  }
  const pattern = /\{@link (.*?)}|`(.*?)`/g;
  while (true) {
    const startIndex = pattern.lastIndex;
    const patternMatch = pattern.exec(text);
    const textSlice = text.slice(startIndex, patternMatch?.index ?? undefined);
    contentNode.append(document.createTextNode(textSlice));

    if (patternMatch?.[1] !== undefined) {
      // If it is a {@link...}
      pattern.lastIndex = patternMatch.index + patternMatch[0].length;
      const linkText = patternMatch[1];
      // contentNode.append(html`
      //   <a href="javascript:void(0)" ${set({ textContent: linkText })}></a>
      // `);
      contentNode.append(html`
        <code ${set({ textContent: linkText })}></code>
      `);
    } else if (patternMatch?.[2] !== undefined) {
      // If it is a `...` (back-tick region)
      pattern.lastIndex = patternMatch.index + patternMatch[0].length;
      const codeText = patternMatch[2];
      contentNode.append(html`
        <code ${set({ textContent: codeText })}></code>
      `);
    } else {
      break;
    }
  }

  return contentNode;
}

const CODE_BACKGROUND = '#272822';
const LEFT_REL_SIZE = 2;
const RIGHT_REL_SIZE = 3;

const style = `
  :host {
    margin-top: 30px;
  }

  .code-controls-container {
    display: grid;
    grid-template-columns: minmax(0, ${LEFT_REL_SIZE}fr) minmax(0, ${RIGHT_REL_SIZE}fr);
  }

  .code-controls {
    display: flex;
    justify-content: right;
    margin: 10px;
    background: ${CODE_BACKGROUND};
    margin: 0;
    padding: 10px;
    border-top-left-radius: 8px;
  }

  .view-mode-buttons {
    display: flex;
    margin-right: 10px;
  }

  .view-mode-button {
    
  }

  .view-mode-button[disabled] {

  }

  .select-all {
    background: #555;
    color: #ccc;
    border: none;
    font-size: 1rem;
    padding: 0.4em;
    letter-spacing: 0.08em;
    border-radius: 1px;
    &:hover {
      background: #666;
      color: white;
      cursor: pointer;
    }
    &:focus {
      outline: 1px solid #22f;
    }
  }

  .documented-code {
    display: grid;
    grid-template-columns: minmax(0, ${LEFT_REL_SIZE}fr) minmax(0, ${RIGHT_REL_SIZE}fr);
  }

  .code-viewer {
    background: ${CODE_BACKGROUND};
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 3em;
  }

  .code-viewer:last-child {
    padding-bottom: 1em;
  }

  .jsdoc-header {
    margin-top: 0;
  }

  .jsdoc-header-label {
    color: #888;
  }

  .jsdoc-header-entity-name {
    color: #333;
  }

  .section-header {
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
  }

  .explanation {
    padding: 30px;
  }

  .example-header {
    font-size: 1rem;
  }

  .example {
    padding-top: 1em;
    padding-bottom: 1em;
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
