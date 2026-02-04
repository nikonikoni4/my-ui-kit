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

  // Strip inline lp comments that should be hidden (todo IDs, system-section markers)
  // Must be done BEFORE HTML escaping
  html = html.replace(/<!-- lp:t-[a-f0-9]+ -->/g, '');
  html = html.replace(/<!-- lp:system-section -->\n?/g, '');

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
  // Handle <!-- lp:todoblock --> wrapped regions (注意：使用 todoblock 而不是 taskblock)
  html = html.replace(
    /&lt;!-- lp:todoblock --&gt;\n([\s\S]*?)&lt;!-- \/lp:todoblock --&gt;/g,
    (_, content) => {
      const parsed = parseTaskListWithIndent(content);
      return `<div data-type="task-block" class="task-block-container">${parsed}</div>`;
    }
  );

  // Handle regular task lists (not inside todoblock)
  html = html.replace(/^(\t*)- \[(x| )\] (.+)$/gm, (_, indent, checked, text) => {
    const isChecked = checked === 'x';
    return `<ul data-type="taskList"><li data-type="taskItem" data-checked="${isChecked}">${text}</li></ul>`;
  });

  // Remove inline lp comments like <!-- lp:t-xxx --> (todo IDs) - they should be hidden
  html = html.replace(/&lt;!-- lp:t-[a-f0-9]+ --&gt;/g, '');

  // Handle <!-- lp:system-section --> as hidden marker (convert to invisible span)
  html = html.replace(
    /&lt;!-- lp:system-section --&gt;/g,
    '<span data-type="system-section" style="display:none;"></span>'
  );

  return html;
}

/**
 * 解析带缩进的任务列表为嵌套 HTML 结构
 * 输入格式:
 *   - [ ] A
 *   \t- [ ] B (tab 缩进表示嵌套)
 *   \t\t- [ ] C (两个 tab 表示更深层嵌套)
 */
function parseTaskListWithIndent(content: string): string {
  const lines = content.split('\n').filter(line => line.trim());

  interface TaskNode {
    checked: boolean;
    text: string;
    children: TaskNode[];
  }

  // 解析所有任务项，构建树结构
  const root: TaskNode[] = [];
  const stack: { node: TaskNode; depth: number }[] = [];

  for (const line of lines) {
    const match = line.match(/^(\t*)- \[(x| )\] (.+)$/);
    if (!match) continue;

    const [, tabs, checked, rawText] = match;
    // Strip inline lp comments like <!-- lp:t-xxx --> from task text
    const text = rawText.replace(/&lt;!-- lp:t-[a-f0-9]+ --&gt;/g, '').trim();
    const depth = tabs.length;
    const node: TaskNode = {
      checked: checked === 'x',
      text,
      children: []
    };

    // 找到父节点
    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      // 根级任务
      root.push(node);
    } else {
      // 添加到父节点的 children
      stack[stack.length - 1].node.children.push(node);
    }

    stack.push({ node, depth });
  }

  // 递归生成 HTML
  function nodeToHtml(nodes: TaskNode[]): string {
    if (nodes.length === 0) return '';

    const items = nodes.map(node => {
      const childrenHtml = nodeToHtml(node.children);
      // 如果有子任务，需要在 li 内部嵌套 ul
      const nestedList = childrenHtml ? `<ul data-type="taskList">${childrenHtml}</ul>` : '';
      return `<li data-type="taskItem" data-checked="${node.checked}">${node.text}${nestedList}</li>`;
    }).join('');

    return items;
  }

  const innerHtml = nodeToHtml(root);
  return innerHtml ? `<ul data-type="taskList">${innerHtml}</ul>` : '';
}
