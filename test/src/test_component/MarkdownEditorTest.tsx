import React, { useState, useRef } from 'react';
import { MarkdownEditor, MarkdownEditorRef } from '@my-ui-kit/core';

const initialMarkdown = `# Welcome to MarkdownEditor

This is a **Tiptap-based** Markdown editor with a *Typora/Notion* style experience.

## Features

- **No toolbar** - Clean, distraction-free interface
- **Slash commands** - Type \`/\` to see available commands
- **Bubble menu** - Select text to format it
- **Keyboard shortcuts** - Ctrl+B for bold, Ctrl+I for italic, etc.

## Try it out

1. Select some text to see the bubble menu
2. Type \`/\` at the start of a line for commands
3. Use keyboard shortcuts like **Ctrl+B** for bold

### Task List

- [x] Create editor component
- [x] Add slash commands
- [ ] Test all features

> This is a blockquote. It can contain **formatted** text.

\`\`\`javascript
// Code blocks are supported too
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

---

Enjoy writing!
`;

export const MarkdownEditorTest: React.FC = () => {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [showOutput, setShowOutput] = useState(false);
  const editorRef = useRef<MarkdownEditorRef>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">MarkdownEditor Test</h2>
        <div className="flex gap-2">
          <button
            onClick={() => editorRef.current?.focus()}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Focus Editor
          </button>
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {showOutput ? 'Hide' : 'Show'} Markdown Output
          </button>
          <button
            onClick={() => {
              const md = editorRef.current?.getMarkdown();
              if (md) {
                navigator.clipboard.writeText(md);
                alert('Markdown copied to clipboard!');
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Copy Markdown
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-left">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Editor</span>
          </div>
          <MarkdownEditor
            ref={editorRef}
            value={markdown}
            onChange={setMarkdown}
            placeholder="Type '/' for commands..."
            minHeight="400px"
            maxHeight="600px"
            autoFocus
          />
        </div>

        {showOutput && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Markdown Output</span>
            </div>
            <pre className="p-4 text-sm overflow-auto max-h-[600px] bg-gray-900 text-gray-100">
              <code>{markdown}</code>
            </pre>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Usage Tips:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Type <code className="bg-blue-100 px-1 rounded">/</code> to open the slash command menu</li>
          <li>• Select text to show the formatting bubble menu</li>
          <li>• Use <code className="bg-blue-100 px-1 rounded">Ctrl+B</code> for bold, <code className="bg-blue-100 px-1 rounded">Ctrl+I</code> for italic</li>
          <li>• Available commands: h1, h2, h3, bullet list, numbered list, task list, quote, code block, divider, table, image</li>
        </ul>
      </div>
    </div>
  );
};

export default MarkdownEditorTest;
