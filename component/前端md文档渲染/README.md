# 实时 Markdown 编辑器组件

> 类似 Typora / 思源笔记的所见即所得 Markdown 编辑器 React 组件

## 特性

- ✅ **实时渲染** - 输入 Markdown 立即显示格式化效果
- 🌙 **深色模式** - 支持亮色/深色主题
- 🛠️ **丰富工具栏** - 快速插入格式、表格、代码块等
- 📝 **Markdown 快捷键** - 支持常用 Markdown 语法快捷输入
- 🎨 **代码高亮** - 支持多种编程语言语法高亮
- 📊 **表格编辑** - 可视化表格创建和编辑
- 🔄 **Source/Rich-text 切换** - 支持查看原始 Markdown 源码

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 在你的项目中使用

### 1. 复制组件

将 `src/components/MarkdownEditor` 目录复制到你的项目中。

### 2. 安装依赖

```bash
npm install @mdxeditor/editor
```

### 3. 使用组件

```tsx
import { useRef } from 'react';
import { MarkdownEditor, MDXEditorMethods } from './components/MarkdownEditor';

function MyComponent() {
  const editorRef = useRef<MDXEditorMethods>(null);

  return (
    <MarkdownEditor
      ref={editorRef}
      markdown="# Hello World"
      onChange={(markdown) => console.log(markdown)}
      darkMode={false}
      showToolbar={true}
    />
  );
}
```

## 组件 API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `markdown` | `string` | `''` | 初始 Markdown 内容 |
| `onChange` | `(markdown: string) => void` | - | 内容变化回调 |
| `readOnly` | `boolean` | `false` | 是否只读 |
| `placeholder` | `string` | `'开始输入 Markdown...'` | 占位符文本 |
| `className` | `string` | `''` | 自定义容器类名 |
| `showToolbar` | `boolean` | `true` | 是否显示工具栏 |
| `showDiffSource` | `boolean` | `true` | 是否显示源码切换 |
| `darkMode` | `boolean` | `false` | 深色模式 |
| `minHeight` | `string` | `'400px'` | 最小高度 |
| `maxHeight` | `string` | `'700px'` | 最大高度 |

### Ref 方法

```tsx
const editorRef = useRef<MDXEditorMethods>(null);

// 获取当前 Markdown 内容
const markdown = editorRef.current?.getMarkdown();

// 设置新内容
editorRef.current?.setMarkdown('# New Content');

// 在光标位置插入内容
editorRef.current?.insertMarkdown('**inserted text**');
```

## 技术栈

- [MDXEditor](https://mdxeditor.dev/) - 底层富文本编辑器
- [React 19](https://react.dev/) - UI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型支持
- [Vite](https://vitejs.dev/) - 构建工具

## 许可证

MIT
