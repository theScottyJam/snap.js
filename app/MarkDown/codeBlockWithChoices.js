import { CodeViewer } from '../CodeViewer.js';
import { html, renderChoice, renderEach, set, Signal } from '../snapFramework.js';
import { defineStyledElement } from '../shared.js';
import { assert } from '../util.js';

export function doesCodeBlockHaveChoices(text) {
  return text.trimStart().startsWith('/*# METADATA');
}

export function replaceWithCodeBlockWithChoices(codeContainerEl) {
  const el = new CodeBlockWithChoices({ unparsedText: codeContainerEl.textContent });
  codeContainerEl.after(el);
  codeContainerEl.parentNode.removeChild(codeContainerEl);
}

const CodeBlockWithChoices = defineStyledElement('CodeBlockWithChoices', getStyles, ({ unparsedText }) => {
  const { metadata, choices } = parseTextWithChoices(unparsedText);
  const signalFormState = new Signal(Object.fromEntries(metadata.map(choice => [choice.id, choice.default])));

  return html`
    ${renderEach(new Signal(metadata.map(choice => [choice.id, choice])), choice => {
      assert(choice.type === 'radio');
      const { id: choiceId, message, options } = choice;
      return html`
        <fieldset class="field-set">
          ${new Text(message)}
          ${renderEach(new Signal(Object.entries(options)), (optionMessage, optionId) => {
            return html`
              <label class="label">
                <input type="radio" class="input" ${set({
                  name: optionId,
                  value: optionId,
                  checked: signalFormState.use(formState => formState[choiceId] === optionId),
                  oninput: () => {
                    return signalFormState.set({ ...signalFormState.get(), [choiceId]: optionId });
                  },
                })}/>
                ${new Text(optionMessage)}
              </label>
            `;
          })}
        </fieldset>
      `;
    })}

    ${renderCodeBlockChoice({ signalFormState, choices })}
  `;
});

function renderCodeBlockChoice({ signalFormState, choices }) {
  return renderChoice([
    ...choices.map(({ condition, text }) => {
      return {
        signalWhen: signalFormState.use(formState => {
          return Object.entries(condition).every(
            ([choiceId, optionId]) => formState[choiceId] === optionId,
          );
        }),
        render: () => new CodeViewer(text),
      };
    }),
    {
      signalWhen: new Signal(true),
      render: () => {
        console.warn('Failed to find a matching choice.');
        return new CodeViewer('');
      },
    },
  ]);
}

/**
 * Returns {
 *   metadata: The JSON-parsed metadata block from the code snippet
 *   choices: {
 *     condition: The JSON-parsed condition for when this choice should be displayed.
 *     text: The code to display for this choice
 *   }
 * }
 */
function parseTextWithChoices(text) {
  const lines = text.split('\n');

  assert(lines.length >= 2);
  assert(lines[0].trim() === '/*# METADATA');
  let index = 1;

  let metadataString = '';
  for (; index < lines.length; index++) {
    const line = lines[index];
    if (line.trim() === '#*/') {
      index++;
      break;
    }
    metadataString += line;
  }
  const metadata = JSON.parse(metadataString);

  const choices = [];
  for (; index < lines.length; index++) {
    const line = lines[index];
    if (choices.length === 0 && line.trim() === '') {
      continue;
    }

    if (line.startsWith('//# CONFIG')) {
      choices.push({
        condition: JSON.parse(line.slice('//# CONFIG'.length)),
        text: '',
      });
      continue;
    }

    assert(
      choices.length !== 0,
      `Expected to find a "//# CONFIG" annotation, on line ${index + 1}`,
    );

    choices.at(-1).text += line + '\n';
  }

  for (const choice of choices) {
    choice.text = choice.text.trim();
  }

  return { metadata, choices };
}

function getStyles() {
  return `
    :host {
      display: block;
      border: 1px solid #ddd;
      padding: 20px;
      padding-bottom: 5px;
      border-radius: 6px;
    }
    
    .field-set {
      border: unset;
      white-space: wrap;
    }
    
    .label {
      display: block;
      cursor: pointer;
    }
    
    .input {
      cursor: pointer;
      margin-right: 5px;
    }
  `;
}
