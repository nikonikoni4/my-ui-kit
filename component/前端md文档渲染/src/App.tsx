import { useRef, useState, useCallback } from 'react';
import { MarkdownEditor } from './components/MarkdownEditor';
import type { MDXEditorMethods } from './components/MarkdownEditor';
import './App.css';

// 示例 Markdown 内容
const initialMarkdown = `# 🚀 欢迎使用实时 Markdown 编辑器

这是一个类似 **Typora** / **思源笔记** 的所见即所得 Markdown 编辑器。

### 📋 任务列表示例

- [ ] 未完成的任务
- [x] 已完成的任务
- [ ] 另一个待办事项

## ✨ 功能特点

- 🎯 **实时渲染** - 输入即可看到格式化效果
- 🌙 **深色模式** - 支持亮色/深色主题切换
- 🛠️ **丰富工具栏** - 快速插入各种格式
- 📝 **Markdown 快捷键** - 熟悉的语法支持

## 📖 Markdown 语法示例

### 文本格式

这是一段普通文本，支持 **粗体**、*斜体*、~~删除线~~ 和 \`行内代码\`。

### 代码块

\`\`\`javascript
// React 组件示例
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      点击次数: {count}
    </button>
  );
}
\`\`\`

### 表格

| 功能 | 支持状态 | 说明 |
|------|:--------:|------|
| 标题 | ✅ | 支持 H1-H6 |
| 列表 | ✅ | 有序/无序列表 |
| 代码块 | ✅ | 语法高亮 |
| 表格 | ✅ | 可视化编辑 |
| 图片 | ✅ | 支持上传/链接 |

### 引用

> 💡 **提示**：使用工具栏按钮或 Markdown 快捷键来格式化内容
>
> 例如输入 \`#\` + 空格 可创建一级标题

### 列表

1. 第一步：安装依赖
2. 第二步：导入组件
3. 第三步：使用组件

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项

---

*开始编辑吧！*
`;

function App() {
    const editorRef = useRef<MDXEditorMethods>(null);
    const [content, setContent] = useState(initialMarkdown);
    const [darkMode, setDarkMode] = useState(false);
    const [showToolbar, setShowToolbar] = useState(true);

    // 切换深色模式
    const toggleDarkMode = useCallback(() => {
        setDarkMode((prev) => !prev);
        document.documentElement.classList.toggle('dark');
    }, []);

    // 获取 Markdown 内容
    const handleGetMarkdown = useCallback(() => {
        const markdown = editorRef.current?.getMarkdown();
        if (markdown) {
            console.log('📄 当前 Markdown 内容:\n', markdown);
            alert('Markdown 内容已输出到控制台 (F12 查看)');
        }
    }, []);

    // 设置新内容
    const handleSetMarkdown = useCallback(() => {
        editorRef.current?.setMarkdown(`# 新文档

这是通过 \`setMarkdown()\` 方法设置的新内容。

## 功能说明

编辑器支持动态设置内容，适合以下场景：
- 加载远程文档
- 切换不同文档
- 重置编辑器内容
`);
    }, []);

    // 清空内容
    const handleClear = useCallback(() => {
        editorRef.current?.setMarkdown('');
    }, []);

    return (
        <div className={`app-container ${darkMode ? 'dark' : ''}`}>
            {/* 头部 */}
            <header className="app-header">
                <div className="header-content">
                    <h1>
                        <span className="logo-icon">📝</span>
                        实时 Markdown 编辑器
                    </h1>
                    <p className="subtitle">类似 Typora / 思源笔记的所见即所得编辑体验</p>
                </div>

                {/* 控制按钮 */}
                <div className="controls">
                    <button
                        className={`control-btn ${darkMode ? 'active' : ''}`}
                        onClick={toggleDarkMode}
                        title="切换深色模式"
                    >
                        {darkMode ? '🌙' : '☀️'}
                    </button>
                    <button
                        className={`control-btn ${showToolbar ? 'active' : ''}`}
                        onClick={() => setShowToolbar(!showToolbar)}
                        title="切换工具栏"
                    >
                        🔧
                    </button>
                </div>
            </header>

            {/* 编辑器区域 */}
            <main className="editor-section">
                <MarkdownEditor
                    ref={editorRef}
                    markdown={content}
                    onChange={setContent}
                    showToolbar={showToolbar}
                    showDiffSource={true}
                    darkMode={darkMode}
                    minHeight="500px"
                    maxHeight="calc(100vh - 280px)"
                    placeholder="在这里输入 Markdown 内容..."
                />
            </main>

            {/* 底部操作栏 */}
            <footer className="action-bar">
                <div className="action-group">
                    <button className="action-btn primary" onClick={handleGetMarkdown}>
                        <span>📋</span> 获取 Markdown
                    </button>
                    <button className="action-btn secondary" onClick={handleSetMarkdown}>
                        <span>📄</span> 设置示例内容
                    </button>
                    <button className="action-btn danger" onClick={handleClear}>
                        <span>🗑️</span> 清空
                    </button>
                </div>

                <div className="stats">
                    <span className="stat-item">
                        字符数: {content.length}
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default App;
