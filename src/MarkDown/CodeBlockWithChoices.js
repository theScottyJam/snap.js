import { useMemo, useState } from 'react';
import style from './CodeBlockWithChoices.style';

export function doesCodeBlockHaveChoices(text) {
  return text.trimStart().startsWith('/*# METADATA');
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

export function CodeBlockWithChoices({ text, renderCodeBlock }) {
  const { metadata, choices } = useMemo(
    () => parseTextWithChoices(text),
    [text]
  );
  const [formState, setFormState] = useState(
    Object.fromEntries(metadata.map(choice => [choice.id, choice.default]))
  );

  return (
    <div className={style.codeBlockWithChoices}>
      {metadata.map(choice => {
        assert(choice.type === 'radio');
        const { id: choiceId, message, options } = choice;
        return (
          <fieldset key={choiceId} className={style.fieldSet}>
            {message}
            {Object.entries(options).map(([optionId, optionMessage]) => {
              return (
                <div key={optionId}>
                  <label className={style.label}>
                    <input
                      type="radio"
                      className={style.input}
                      name={optionId}
                      value={optionId}
                      checked={formState[choiceId] === optionId}
                      onChange={() =>
                        setFormState(currentFormState => ({
                          ...currentFormState,
                          [choiceId]: optionId,
                        }))
                      }
                    />
                    {optionMessage}
                  </label>
                </div>
              );
            })}
          </fieldset>
        );
      })}

      <CodeBlockChoice
        formState={formState}
        choices={choices}
        renderCodeBlock={renderCodeBlock}
      />
    </div>
  );
}

function CodeBlockChoice({ formState, choices, renderCodeBlock }) {
  for (const { condition, text } of choices) {
    if (
      Object.entries(condition).every(
        ([choiceId, optionId]) => formState[choiceId] === optionId
      )
    ) {
      return renderCodeBlock(text);
    }
  }

  console.warn('Failed to find a matching choice.');
  return renderCodeBlock('');
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
      `Expected to find a "//# CONFIG" annotation, on line ${index + 1}`
    );

    choices.at(-1).text += line + '\n';
  }

  for (const choice of choices) {
    choice.text = choice.text.trim();
  }

  return { metadata, choices };
}
