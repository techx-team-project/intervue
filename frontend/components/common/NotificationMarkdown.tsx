interface NotificationMarkdownProps {
  content: string;
}

type Block =
  { kind: 'heading'; text: string } | { kind: 'list'; items: string[] } | { kind: 'paragraph'; text: string };

function parse(content: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length > 0) {
      blocks.push({ kind: 'list', items: list });
      list = [];
    }
  };

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (line === '') {
      flushParagraph();
      flushList();
    } else if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ kind: 'heading', text: line.slice(3).trim() });
    } else if (line.startsWith('- ')) {
      flushParagraph();
      list.push(line.slice(2).trim());
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

// Renders plain text nodes only: notification bodies include admin-authored broadcasts,
// so no raw HTML is ever injected.
function renderInline(text: string, keyPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={key} className="dark:text-forest-50 text-on-surface font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

export default function NotificationMarkdown({ content }: NotificationMarkdownProps) {
  const blocks = parse(content);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.kind === 'heading') {
          return (
            <h3 key={index} className="dark:text-forest-50 text-on-surface text-sm font-bold sm:text-base">
              {block.text}
            </h3>
          );
        }
        if (block.kind === 'list') {
          return (
            <ul key={index} className="marker:text-primary list-disc space-y-1.5 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="dark:text-forest-200 text-on-surface leading-relaxed">
                  {renderInline(item, `${index}-${itemIndex}`)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="dark:text-forest-200 text-on-surface leading-relaxed">
            {renderInline(block.text, String(index))}
          </p>
        );
      })}
    </div>
  );
}
