import React from 'react';

interface CowsayProps {
  text: string;
}

export const Cowsay: React.FC<CowsayProps> = ({ text }) => {
  const maxLen = 40;
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + ' ' + word).trim().length <= maxLen) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);

  const length = Math.max(...lines.map(l => l.length), 10);
  const borderTop = ' ' + '_'.repeat(length + 2);
  const borderBottom = ' ' + '-'.repeat(length + 2);

  const bubble = lines.map((line, idx) => {
    const pad = ' '.repeat(length - line.length);
    if (lines.length === 1) return `< ${line}${pad} >`;
    if (idx === 0) return `/ ${line}${pad} \\`;
    if (idx === lines.length - 1) return `\\ ${line}${pad} /`;
    return `| ${line}${pad} |`;
  }).join('\n');

  const cow = `        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

  return (
    <div className="font-mono text-sm leading-tight text-emerald-400 whitespace-pre my-2">
      {borderTop}
      {'\n'}
      {bubble}
      {'\n'}
      {borderBottom}
      {'\n'}
      {cow}
    </div>
  );
};
