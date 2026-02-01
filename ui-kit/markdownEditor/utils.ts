import { Editor } from '@tiptap/react';

/**
 * Convert Tiptap editor content to Markdown string
 */
export function editorToMarkdown(editor: Editor): string {
  const json = editor.getJSON();
  return jsonToMarkdown(json);
}

/**
 * Convert Tiptap JSON to Markdown
 */
function jsonToMarkdown(node: any, listDepth = 0): string {
  if (!node) return '';

  const { type, content, attrs, marks, text } = node;

  // Handle text nodes with marks
  if (type === 'text') {
    let result = text || '';
    if (marks) {
      marks.forEach((mark: any) => {
        switch (mark.type) {
          case 'bold':
            result = `**${result}**`;
            break;
          case 'italic':
            result = `*${result}*`;
            break;
          case 'strike':
            result = `~~${result}~~`;
            break;
          case 'underline':
            result = `<u>${result}</u>`;
            break;
          case 'code':
            result = `\`${result}\``;
            break;
          case 'link':
            result = `[${result}](${mark.attrs?.href || ''})`;
            break;
        }
      });
    }
    return result;
  }

  // Handle block nodes
  const childContent = content?.map((child: any) => jsonToMarkdown(child, listDepth)).join('') || '';

  switch (type) {
    case 'doc':
      return childContent;
    case 'paragraph':
      return childContent + '\n\n';
    case 'heading':
      const level = attrs?.level || 1;
      return '#'.repeat(level) + ' ' + childContent + '\n\n';
    case 'bulletList':
      return content?.map((item: any) => jsonToMarkdown(item, listDepth)).join('') || '';
    case 'orderedList':
      return content?.map((item: any, index: number) => {
        const itemContent = item.content?.map((child: any) => jsonToMarkdown(child, listDepth)).join('') || '';
        return '  '.repeat(listDepth) + `${index + 1}. ` + itemContent.trim() + '\n';
      }).join('') + '\n';
    case 'listItem':
      const indent = '  '.repeat(listDepth);
      return indent + '- ' + childContent.trim() + '\n';
    case 'taskListContainer': {
      const taskContent = content?.map((item: any) => jsonToMarkdown(item, 0)).join('') || '';
      return `<!-- lp:todoblock -->\n${taskContent}<!-- /lp:todoblock -->\n\n`;
    }
    case 'taskList':
      return content?.map((item: any) => jsonToMarkdown(item, listDepth)).join('') || '';
    case 'taskItem': {
      const checked = attrs?.checked ? 'x' : ' ';
      const indent = '\t'.repeat(listDepth);
      // Handle nested taskList (subtasks)
      const parts = content || [];
      let textContent = '';
      let nestedContent = '';

      for (const child of parts) {
        if (child.type === 'taskList') {
          nestedContent += jsonToMarkdown(child, listDepth + 1);
        } else {
          textContent += jsonToMarkdown(child, listDepth);
        }
      }

      return `${indent}- [${checked}] ${textContent.trim()}\n${nestedContent}`;
    }
    case 'blockquote':
      return childContent.split('\n').filter(Boolean).map((line: string) => '> ' + line).join('\n') + '\n\n';
    case 'codeBlock':
      const lang = attrs?.language || '';
      return '```' + lang + '\n' + childContent + '```\n\n';
    case 'horizontalRule':
      return '---\n\n';
    case 'table':
      return tableToMarkdown(node) + '\n';
    case 'image':
      return `![${attrs?.alt || ''}](${attrs?.src || ''})\n\n`;
    case 'hardBreak':
      return '\n';
    default:
      return childContent;
  }
}

/**
 * Convert table node to Markdown
 */
function tableToMarkdown(tableNode: any): string {
  if (!tableNode.content) return '';

  const rows = tableNode.content;
  const result: string[] = [];

  rows.forEach((row: any, rowIndex: number) => {
    if (!row.content) return;

    const cells = row.content.map((cell: any) => {
      const cellContent = cell.content?.map((child: any) => jsonToMarkdown(child, 0)).join('').trim() || '';
      return cellContent.replace(/\n/g, ' ');
    });

    result.push('| ' + cells.join(' | ') + ' |');

    // Add header separator after first row
    if (rowIndex === 0) {
      result.push('| ' + cells.map(() => '---').join(' | ') + ' |');
    }
  });

  return result.join('\n');
}

/**
 * Parse Markdown string to HTML for Tiptap
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Handle taskblock comments and task lists
  html = parseTaskBlocks(html);

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<ul><li>$1</li></ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<ol><li>$1</li></ol>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr>');

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // Paragraphs (simple approach)
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');

  return html;
}

/**
 * Parse taskblock comments and task lists
 */
function parseTaskBlocks(html: string): string {
  // Handle <!-- lp:todoblock --> wrapped regions
  html = html.replace(
    /&lt;!-- lp:taskblock --&gt;\n([\s\S]*?)&lt;!-- \/lp:taskblock --&gt;/g,
    (_, content) => {
      const parsed = parseTaskListWithIndent(content);
      return `<div data-type="task-block" class="task-block-container">${parsed}</div>`;
    }
  );

  // Handle regular task lists (not inside taskblock)
  html = html.replace(/^(\t*)- \[(x| )\] (.+)$/gm, (_, indent, checked, text) => {
    const isChecked = checked === 'x';
    return `<ul data-type="taskList"><li data-type="taskItem" data-checked="${isChecked}">${text}</li></ul>`;
  });

  return html;
}

/**
 * Parse task list content with indentation support
 */
function parseTaskListWithIndent(content: string): string {
  const lines = content.split('\n').filter(line => line.trim());
  return lines.map(line => {
    const match = line.match(/^(\t*)- \[(x| )\] (.+)$/);
    if (match) {
      const [, , checked, text] = match;
      const isChecked = checked === 'x';
      return `<ul data-type="taskList"><li data-type="taskItem" data-checked="${isChecked}">${text}</li></ul>`;
    }
    return line;
  }).join('');
}
