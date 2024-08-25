/* eslint-disable react-hooks/rules-of-hooks */

import { defineElement, html, renderChoice, renderEach, set, Signal, useSignals } from './snapFramework.js';
import { CodeViewer } from './CodeViewer.js';
import { assert } from './util.js';
import { PUBLIC_URL } from './shared.js';
import { ICON_BUTTON_BACKGROUND_ON_HOVER, ICON_BUTTON_OUTLINE_ON_FOCUS } from './sharedStyles.js';
import { showPopupWithExample } from './RunnableExamplePopup.js';

// This is the point in which we switch to using a single-column layout for the code/docs
const SMALL_SCREEN_SIZE = '1200px';
const isSmallScreenSize$ = new Signal(false);

const smallScreenSizeMedia = matchMedia(`(max-width: ${SMALL_SCREEN_SIZE})`);
smallScreenSizeMedia.addEventListener('change', event => {
  isSmallScreenSize$.set(event.matches);
});
isSmallScreenSize$.set(smallScreenSizeMedia.matches);

function doesLineHavePragma(line, pragma) {
  return line.match(/\/\/# *([a-zA-Z0-9_-]+)/)?.[1] === pragma;
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

  /** For debugging purposes */
  _getLines() {
    return this.#lines;
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
  const viewMode$ = new Signal('normal'); // Values can be 'full-docs', 'normal', or 'minified'.
  return html`
    ${renderControls({
      documentedCodeRef,
      viewMode$,
      updateViewMode: newViewMode => viewMode$.set(newViewMode),
    })}
    <div ${set({
      className: useSignals([viewMode$], viewMode => 'documented-code-grid' + (viewMode === 'minified' ? ' minified' : '')),
    }, el => documentedCodeRef.set(el))}>
      ${renderFrameworkSourceViewerContent({ fullText, minifiedText, viewMode$ })}
    </div>

    <style ${set({ textContent: style })}></style>
  `;
});

function renderControls({ documentedCodeRef, viewMode$, updateViewMode }) {
  return html`
    <div class="code-controls-container documented-code-grid">
      <div></div> <!-- empty space to fill the left side -->
      <div class="code-controls">
        <div class="view-mode-buttons">
          <button ${set({
            onclick: () => updateViewMode('full-docs'),
            disabled: useSignals([viewMode$], viewMode => viewMode === 'full-docs'),
          })}>
            Self-contained docs
            <span class="more-info-icon" title="All documentation from this webpage will be placed inside of JSDocs. A good starting point if you want to take full ownership of the code.">ⓘ</span>
          </button>
          <button ${set({
            onclick: () => updateViewMode('normal'),
            disabled: useSignals([viewMode$], viewMode => viewMode === 'normal'),
          })}>
            Classic
            <span class="more-info-icon" title="Minimal documentation is included - to see the full docs, you can follow a link included at the top of the file.">ⓘ</span>
          </button>
          <button ${set({
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

export function renderFrameworkSourceViewerContent({ fullText, minifiedText, viewMode$ }) {
  const lineBuffer = new LineBuffer(fullText.split('\n'));
  const isBlankLine = line => line.match(/^ *$/);
  const isNotBlankLine = line => !line.match(/^ *$/);
  const isStartPragma = line => doesLineHavePragma(line, 'START');
  const hasClosingCommentToken = line => line.includes('*/');

  const getGridPosStyleForCodeBlock = (rowNumb_, { isSectionHeading = false } = {}) => useSignals([isSmallScreenSize$], isSmallScreenSize => {
    const offset = isSectionHeading ? 0 : 1;
    const rowNumb = isSmallScreenSize ? rowNumb_ * 2 + offset : rowNumb_;
    const colNumb = isSmallScreenSize ? 1 : 2;
    return `grid-row: ${rowNumb}; grid-column: ${colNumb}`;
  });

  const getGridPosStyleForDocsBlock = (rowNumb_, { isSectionHeading = false } = {}) => useSignals([viewMode$, isSmallScreenSize$], (viewMode, isSmallScreenSize) => {
    const offset = isSectionHeading ? 1 : 0;
    const rowNumb = isSmallScreenSize ? rowNumb_ * 2 + offset : rowNumb_;
    return viewMode === 'minified' ? 'display: none' : `grid-row: ${rowNumb}; grid-column: 1`;
  });

  // Jump to `//# START` pragma
  lineBuffer.grabLinesUntilPast({ isStartPragma });

  const docNodes = [];
  const codeNodes = [];
  let jsDocsInfo = undefined; // If jsdocs were previously found, this will have the shape { render: ..., lines: ... }
  let inTopLevelJsDocs = false;
  let rowNumb = 1;
  while (!lineBuffer.atEnd()) {
    if (!inTopLevelJsDocs) {
      let { normalLines, fullDocsLines, stopReason } = gatherCodeLines({ lineBuffer })
      if (!normalLines.every(line => isBlankLine(line))) {
        const curRowNumb = rowNumb++;

        docNodes.push(jsDocsInfo !== undefined
          ? jsDocsInfo.render(curRowNumb)
          : html`
            <div class="explanation" ${set({
              style: useSignals([viewMode$, getGridPosStyleForDocsBlock(curRowNumb), isSmallScreenSize$], (viewMode, gridPosStyle, isSmallScreenSize) => {
                return `display: ${viewMode === 'minified' || isSmallScreenSize ? 'none' : 'unset'}; ${gridPosStyle}`;
              }),
            })}></div>
          `
        );

        const jsDocsLines = reformatJsdocsForDisplay(jsDocsInfo?.lines ?? []);
        codeNodes.push(html`
          ${renderChoice([
            {
              signalWhen: useSignals([viewMode$], viewMode => viewMode === 'full-docs'),
              render: () => html`
                <div class="code-viewer" ${set({ style: getGridPosStyleForCodeBlock(curRowNumb) })}>
                  ${new CodeViewer([...jsDocsLines, ...fullDocsLines].join('\n') + '\n', { theme: 'dark' })}
                </div>
              `,
            },
            {
              signalWhen: useSignals([viewMode$], viewMode => viewMode === 'normal'),
              render: () => html`
                <div class="code-viewer" ${set({ style: getGridPosStyleForCodeBlock(curRowNumb) })}>
                  ${new CodeViewer(normalLines.join('\n') + '\n', { theme: 'dark' })}
                </div>
              `,
            },
            {
              // viewMode === 'minified'
              signalWhen: new Signal(true),
              render: () => html``,
            },
          ])}
        `);
        jsDocsInfo = undefined;
      } else {
        assert(jsDocsInfo === undefined, 'A jsdoc node was created, but we failed to find a spot to place it.');
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
        const curRowNumb = rowNumb++;

        docNodes.push(html`
          <h1 class="explanation section-header" ${set({
            textContent: '— ' + sectionHeaderText + ' —',
            style: getGridPosStyleForDocsBlock(curRowNumb, { isSectionHeading: true }),
          })}></h1>
        `);
        codeNodes.push(html`
          <div class="code-viewer section-header" ${
            set({
              // eslint-disable-next-line no-loop-func
              style: useSignals([viewMode$, getGridPosStyleForCodeBlock(curRowNumb, { isSectionHeading: true })], (viewMode, gridPosStyle) => {
                return `display: ${viewMode === 'minified' ? 'none' : 'block'}; ${gridPosStyle}`;
              }),
            })
          }>
            ${new CodeViewer([rawSectionHeaderText, ...section].join('\n') + '\n', { theme: 'dark' })}
          </div>
        `);
      }
    } else {
      const { section, stopReason } = lineBuffer.grabLinesUntilPast({ hasClosingCommentToken });
      assert(stopReason !== 'END');
      assert(jsDocsInfo === undefined, 'two top-level js-doc comments were found in a row, and the webpage is not programmed to know how to render that.');
      const lineBeingAnnotated = lineBuffer.currentLine();
      jsDocsInfo = {
        lines: section,
        render: rowNumb => renderJsDocs({
          lines: section,
          lineBeingAnnotated,
          gridPosStyle$: getGridPosStyleForDocsBlock(rowNumb),
        }),
      };
      inTopLevelJsDocs = false;
    }
  }

  assert(jsDocsInfo === undefined, 'A jsdoc node was created, but we failed to find a spot to place it.');

  codeNodes.at(-1).querySelector('.code-viewer').classList.add('last');

  const allNodes = document.createDocumentFragment();
  allNodes.append(
    ...docNodes,
    ...codeNodes,
  );
  
  const curRowNumb = rowNumb;
  allNodes.append(html`
    <div class="code-viewer" ${set({
      style: useSignals([viewMode$], viewMode => {
        return `grid-row: 1 / ${curRowNumb}; grid-column: 2; display: ${viewMode === 'minified' ? 'block' : 'none'}`;
      }),
    })}>
      ${new CodeViewer(minifiedText, { theme: 'dark', wrapWithinWords: true })}
    </div>
  `);
  return allNodes;
}

function gatherCodeLines({ lineBuffer }) {
  const isTopLevelOpeningJsDocToken = line => line === '/**';
  const isNormalViewOnlyLineNext = line => doesLineHavePragma(line, 'NORMAL-VIEW-ONLY-NEXT');

  let normalLines = [];
  let fullDocsLines = [];
  while (true) {
    const { section, stopReason } = lineBuffer.grabLinesUntil({ isTopLevelOpeningJsDocToken, isSectionHeading, isNormalViewOnlyLineNext });
    normalLines.push(...section);
    fullDocsLines.push(...section);

    if (stopReason === 'isNormalViewOnlyLineNext') {
      lineBuffer.next(); // Skip the line with the pragma
      normalLines.push(lineBuffer.currentLine());
      lineBuffer.next();
      continue;
    }

    return { normalLines, fullDocsLines, stopReason };
  }
}

function reformatJsdocsForDisplay(lines) {
  if (lines.length === 0) {
    return [];
  }

  const newLines = ['/**'];
  let inCompleteExample = false;
  for (const line of lines) {
    if (doesLineHavePragma(line, 'COLLAPSE-EXAMPLES') || doesLineHavePragma(line, 'AUTO-OPEN')) {
      continue;
    }
    if (doesLineHavePragma(line, 'COMPLETE-EXAMPLE-START')) {
      inCompleteExample = true;
      continue;
    }
    if (doesLineHavePragma(line, 'COMPLETE-EXAMPLE-END')) {
      inCompleteExample = false;
      continue;
    }
    if (!inCompleteExample) {
      newLines.push(line);
    }
  }

  newLines.push(' */')
  return newLines;
}

function renderJsDocs({ lines: lines_, lineBeingAnnotated, gridPosStyle$ }) {
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
    <div class="explanation" ${set({ style: gridPosStyle$ })}>
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

  // A multi-line bullet point will typically look like this ("|" representing the start of the line):
  // |/** description
  // | * * point 1
  // | *   more info about point 1
  // | * * point 2
  //
  // After the comment syntax has been stripped, it'll look like this ("|" representing the start of the line):
  // |description
  // |* point 1
  // |  more info about point 1
  // |* point 2
  //
  // Note the double space that exists on the continuation line.
  // This is what we use to decide if the line should be
  // treated as a continuation or not.
  const isBulletPointContinuationLine = line => line.match(/^ {2}/);

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
        new Signal(bulletPoints.map((bulletedText, i) => [i, bulletedText])),
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

  // A multi-line param will typically look like this ("|" representing the start of the line):
  // |/** description
  // | * @param param1 some description
  // | *   more info about param1
  // | * @param param2 some description
  //
  // After the comment syntax has been stripped, it'll look like this ("|" representing the start of the line):
  // |description
  // |@param param1 some description
  // |  more info about param1
  // |@param param2 some description
  //
  // Note the double space that exists on the continuation line.
  // This is what we use to decide if the line should be
  // treated as a continuation or not.
  const isParamContinuationLine = line => line.match(/^ {2}/);

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
        new Signal(paramDescriptions.map((paramInfo, i) => [i, paramInfo])),
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
  const isStartOfExtraDetails = line => doesLineHavePragma(line, 'COMPLETE-EXAMPLE-START');
  const isEndOfExtraDetails = line => doesLineHavePragma(line, 'COMPLETE-EXAMPLE-END');
  const isAutoOpen = line => doesLineHavePragma(line, 'AUTO-OPEN');
  const extractExampleName = line => line.match(/<caption>(.*)<\/caption>/)?.[1];
  
  const contentNode = document.createDocumentFragment();

  let currentExampleDescription; // Set to the current example's description, or undefined if it doesn't have one.
  let collapseExamples = false;
  let inExtraDetails = false;
  let conciseExample = [];
  let fullExample = [];
  let autoOpen = false;
  while (!lineBuffer.atEnd()) {
    const { section, stopReason } = lineBuffer.grabLinesUntil({
      isStartOfExample,
      isCollapseExamplesPragma,
      isStartOfExtraDetails,
      isEndOfExtraDetails,
      isAutoOpen,
    });

    fullExample.push(...section);
    if (!inExtraDetails) {
      conciseExample.push(...section);
    }

    if (stopReason === 'isStartOfExtraDetails') {
      assert(inExtraDetails === false);
      inExtraDetails = true;
      lineBuffer.next(); // Skip past the pragma
      continue;
    }

    if (stopReason === 'isEndOfExtraDetails') {
      assert(inExtraDetails === true);
      inExtraDetails = false;
      lineBuffer.next(); // Skip past the pragma
      if (!lineBuffer.atEnd()) {
        continue;
      }
    }

    if (stopReason === 'isAutoOpen') {
      autoOpen = true;
      lineBuffer.next(); // Skip past the pragma
      if (!lineBuffer.atEnd()) {
        continue;
      }
    }

    if (stopReason === 'isCollapseExamplesPragma') {
      lineBuffer.next(); // Skip past the pragma
      // The pragma can only be placed directly before '@example'.
      assert(isStartOfExample(lineBuffer.currentLine()));
    }

    if (fullExample.length > 0) {
      assert(conciseExample.length > 0);

      const conciseExampleStr = conciseExample.join('\n');
      const fullExampleStr = fullExample.join('\n');

      const codeViewerEl = html`
        <div class="example">
          ${new CodeViewer(conciseExampleStr, { theme: 'light' })}
          <button class="show-complete-example" title="Run example" ${set({
            onclick: () => showPopupWithExample(fullExampleStr),
          })}>
            <img ${set({ src: `${PUBLIC_URL}/assets/play.svg`, alt: 'Run example' })}>
          </button>
        </div>
      `;
      if (autoOpen) {
        setTimeout(() => {
          showPopupWithExample(fullExampleStr);
        });
      }
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
    conciseExample = [];
    fullExample = [];
    autoOpen = false;
    assert(inExtraDetails === false);
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
      if (linkText.startsWith('https://')) {
        const [url, displayText=url] = linkText.split('|');
        contentNode.append(html`
          <a ${set({ href: url, textContent: displayText })}></a>
        `);
      } else {
        // contentNode.append(html`
        //   <a href="javascript:void(0)" ${set({ textContent: linkText })}></a>
        // `);
        contentNode.append(html`
          <code ${set({ textContent: linkText })}></code>
        `);
      }
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

const EXPLANATION_WIDTH = '690px';
const CODE_BACKGROUND = '#272822';
const CODE_CONTROL_BORDER_RADIUS = '8px';
const CODE_CONTROL_INNER_BORDER_RADIUS = '4px';
const CODE_CONTROL_BUTTON_MAIN_COLOR = '#ccc';
const VERTICAL_SPACING = '60px';
const SMALL_SCREEN_LEFT_GUTTER_SIZE = '5px';
const SMALL_SCREEN_RIGHT_GUTTER_SIZE = `calc(100vw - ${EXPLANATION_WIDTH})`;
const MOBILE_SCREEN_GUTTER_SIZE = '8px';
const SMALL_SCREEN_BORDER_RADIUS = '10px';

const style = `
  :host {
    margin-top: 30px;
  }

  .documented-code-grid {
    display: grid;
    grid-template-columns: ${EXPLANATION_WIDTH} minmax(0, 1fr);
  }

  .code-controls {
    display: flex;
    justify-content: right;
    gap: 10px;
    background: ${CODE_BACKGROUND};
    margin: 0;
    padding: 10px;
    border-top-left-radius: 8px;
  }

  .code-controls button {
    color: ${CODE_CONTROL_BUTTON_MAIN_COLOR};
    background: ${CODE_BACKGROUND};
    font-size: 1rem;
    padding: 0.4em 0.6em;
    letter-spacing: 0.08em;
    cursor: pointer;
  }

  .view-mode-buttons {
    display: flex;
    background: ${CODE_BACKGROUND};
    border-radius: ${CODE_CONTROL_BORDER_RADIUS};
    border: 1px solid ${CODE_CONTROL_BUTTON_MAIN_COLOR};
  }

  .view-mode-buttons button {
    border-radius: ${CODE_CONTROL_INNER_BORDER_RADIUS};
    border: none;
    margin: 3px;
    padding: 0.4em 0.6em;
    &[disabled] {
      background: #555;
    }
    &:not([disabled]) {
      cursor: pointer;
    }
    &:not([disabled]):hover {
      color: white;
      background: rgba(255, 255, 255, 0.07);
    }
  }

  .select-all {
    border-radius: ${CODE_CONTROL_BORDER_RADIUS};
    border: 1px solid ${CODE_CONTROL_BUTTON_MAIN_COLOR};
    /* This allows the ::after pseudo-element to be absolutely positioned inside of the button. */
    position: relative;

    &:not([disabled]):hover {
      color: white;
      border: 1px solid white;
      outline: 1px solid #aaa;
    }
    &:focus::after {
      content: '';
      position: absolute;
      border-radius: ${CODE_CONTROL_INNER_BORDER_RADIUS};
      border: 1px solid ${CODE_CONTROL_BUTTON_MAIN_COLOR};
      left: 1px;
      right: 1px;
      bottom: 1px;
      top: 1px;
    }
  }

  .more-info-icon {
    font-weight: bold;
    font-size: 0.8em;
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

  .explanation.section-header {
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
  }

  .explanation {
    padding: 0px 20px ${VERTICAL_SPACING};
  }

  .example-header {
    font-size: 1rem;
  }

  .example {
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 0.93em;
    /* Causes the "run" button to be positioned relative to this container */
    position: relative;
  }

  .show-complete-example {
    position: absolute;
    top: 16px;
    right: 5px;
    cursor: pointer;
    opacity: 0;
    background: white;
    border: none;
  }

  .example:hover .show-complete-example {
    /*
      Using opacity instead of display or visibility to ensure you can still
      focus this element by tabbing through the page, and as an easy way to
      control the darkness of the color.
    */
    opacity: 0.6;
  }

  .show-complete-example:hover {
    opacity: 0.9;
    background: ${ICON_BUTTON_BACKGROUND_ON_HOVER};
  }

  .show-complete-example:focus {
    opacity: 0.6;
    outline: ${ICON_BUTTON_OUTLINE_ON_FOCUS};
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

  @media screen and (max-width: 1480px) {
    .code-viewer {
      font-size: 0.8em;
    }
  }

  @media screen and (max-width: 1330px) {
    .code-controls {
      flex-flow: column;
      align-items: flex-end;
    }
  }

  /* // <-- The lifecycle section header is incorrectly rendered - bad bottom-padding (margin?) and bottom-right border radius */
  @media screen and (max-width: ${SMALL_SCREEN_SIZE}) {
    .documented-code-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
    }

    :host .explanation {
      margin-right: ${SMALL_SCREEN_RIGHT_GUTTER_SIZE};
      border-top-right-radius: ${SMALL_SCREEN_BORDER_RADIUS};
      border-bottom-right-radius: ${SMALL_SCREEN_BORDER_RADIUS};
      background: white;
      padding-top: ${VERTICAL_SPACING};
      padding-left: calc(${SMALL_SCREEN_LEFT_GUTTER_SIZE} + ${SMALL_SCREEN_BORDER_RADIUS} + 20px);
      /* Allow the ::before element to be positioned relative to this element */
      position: relative;
      &::before {
        content: '';
        background: ${CODE_BACKGROUND};
        position: absolute;
        top: 0;
        left: 0;
        right: calc(0px - ${SMALL_SCREEN_RIGHT_GUTTER_SIZE});
        bottom: 0;
        z-index: -1;
      }
      &.section-header {
        border-bottom-right-radius: 0;
        padding-bottom: 0;
      }
      &.section-header + .explanation {
        border-top-right-radius: 0;
      }
    }

    .code-viewer {
      margin-left: ${SMALL_SCREEN_LEFT_GUTTER_SIZE};
      border-top-left-radius: ${SMALL_SCREEN_BORDER_RADIUS};
      border-bottom-left-radius: ${SMALL_SCREEN_BORDER_RADIUS};
      padding-top: ${SMALL_SCREEN_BORDER_RADIUS};
      padding-bottom: ${SMALL_SCREEN_BORDER_RADIUS};
      &:nth-child(1 of .code-viewer) {
        border-top-left-radius: 0;
        margin-left: 0;
      }
      /* Targets the first heading */
      &:nth-child(2 of .code-viewer) {
        margin-left: 0;
        border-bottom-left-radius: 0;
      }
      &.last {
        border-bottom-left-radius: 0;
      }
      &.section-header {
        border-top-left-radius: 0;
      }
      &:has(+ .code-viewer.section-header) {
        border-bottom-left-radius: 0;
      }
    }
    
    .code-controls {
      border-top-left-radius: 0;
    }

    .code-viewer {
      font-size: 1em;
    }
  }

  @media screen and (max-width: 830px) {
    .code-viewer {
      font-size: 0.8em;
    }

    :host .explanation {
      margin-right: ${MOBILE_SCREEN_GUTTER_SIZE};
      padding-left: calc(${MOBILE_SCREEN_GUTTER_SIZE} + ${SMALL_SCREEN_BORDER_RADIUS} + 20px);
      &::before {
        right: calc(0px - ${MOBILE_SCREEN_GUTTER_SIZE});
      }
    }

    .code-viewer {
      margin-left: ${MOBILE_SCREEN_GUTTER_SIZE};
    }
  }
`;
