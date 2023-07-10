import MarkDown from '../../MarkDown';

export default function Description({ description, summary }) {
  return <MarkDown>{summary + '\n\n' + description}</MarkDown>;
}
