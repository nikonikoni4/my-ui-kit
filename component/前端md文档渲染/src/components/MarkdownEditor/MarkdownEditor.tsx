import React, { forwardRef, useMemo } from 'react';
import {
    MDXEditor,
    MDXEditorMethods,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    linkPlugin,
    linkDialogPlugin,
    imagePlugin,
    tablePlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
    toolbarPlugin,
    BoldItalicUnderlineToggles,
    UndoRedo,
    BlockTypeSelect,
    CreateLink,
    InsertImage,
    InsertTable,
    ListsToggle,
    CodeToggle,
    InsertThematicBreak,
    DiffSourceToggleWrapper,
    Separator,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './MarkdownEditor.css';

export interface MarkdownEditorProps {
    /** 初始 Markdown 内容 */
    markdown?: string;
    /** 内容变化回调 */
    onChange?: (markdown: string) => void;
    /** 是否只读 */
    readOnly?: boolean;
    /** 占位符文本 */
    placeholder?: string;
    /** 自定义类名 */
    className?: string;
    /** 内容区域类名（用于样式定制） */
    contentClassName?: string;
    /** 是否显示工具栏 */
    showToolbar?: boolean;
    /** 是否显示 Diff/Source 切换 */
    showDiffSource?: boolean;
    /** 深色模式 */
    darkMode?: boolean;
    /** 最小高度 */
    minHeight?: string;
    /** 最大高度 */
    maxHeight?: string;
}

/**
 * 实时 Markdown 编辑器组件
 * 类似 Typora/思源笔记的所见即所得编辑体验
 */
export const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
    (
        {
            markdown = '',
            onChange,
            readOnly = false,
            placeholder = '开始输入 Markdown...',
            className = '',
            contentClassName = 'md-content',
            showToolbar = true,
            showDiffSource = true,
            darkMode = false,
            minHeight = '400px',
            maxHeight = '700px',
        },
        ref
    ) => {
        // 构建插件列表
        const plugins = useMemo(() => {
            const basePlugins = [
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin({
                    imageUploadHandler: async () => {
                        // 默认返回一个占位符，实际使用时可替换为真实上传逻辑
                        return Promise.resolve('https://via.placeholder.com/400x200');
                    },
                }),
                tablePlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: 'javascript' }),
                codeMirrorPlugin({
                    codeBlockLanguages: {
                        '': 'Plain Text',
                        js: 'JavaScript',
                        javascript: 'JavaScript',
                        ts: 'TypeScript',
                        typescript: 'TypeScript',
                        jsx: 'JSX',
                        tsx: 'TSX',
                        css: 'CSS',
                        scss: 'SCSS',
                        less: 'Less',
                        html: 'HTML',
                        json: 'JSON',
                        python: 'Python',
                        py: 'Python',
                        java: 'Java',
                        go: 'Go',
                        rust: 'Rust',
                        c: 'C',
                        cpp: 'C++',
                        csharp: 'C#',
                        sql: 'SQL',
                        bash: 'Bash',
                        shell: 'Shell',
                        powershell: 'PowerShell',
                        markdown: 'Markdown',
                        md: 'Markdown',
                        yaml: 'YAML',
                        yml: 'YAML',
                        xml: 'XML',
                        dockerfile: 'Dockerfile',
                        nginx: 'Nginx',
                    },
                }),
            ];

            // 添加 Diff/Source 插件
            if (showDiffSource) {
                basePlugins.push(
                    diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: markdown })
                );
            }

            // 添加工具栏插件
            if (showToolbar) {
                basePlugins.push(
                    toolbarPlugin({
                        toolbarContents: () => {
                            const DefaultToolbar = () => (
                                <>
                                    <UndoRedo />
                                    <Separator />
                                    <BlockTypeSelect />
                                    <Separator />
                                    <BoldItalicUnderlineToggles />
                                    <CodeToggle />
                                    <Separator />
                                    <ListsToggle />
                                    <Separator />
                                    <CreateLink />
                                    <InsertImage />
                                    <InsertTable />
                                    <InsertThematicBreak />
                                </>
                            );

                            return showDiffSource ? (
                                <DiffSourceToggleWrapper>
                                    <DefaultToolbar />
                                </DiffSourceToggleWrapper>
                            ) : (
                                <DefaultToolbar />
                            );
                        },
                    })
                );
            }

            return basePlugins;
        }, [showToolbar, showDiffSource, markdown]);

        const containerStyle = {
            '--md-editor-min-height': minHeight,
            '--md-editor-max-height': maxHeight,
        } as React.CSSProperties;

        return (
            <div
                className={`markdown-editor-wrapper ${darkMode ? 'dark' : ''} ${className}`}
                style={containerStyle}
            >
                <MDXEditor
                    ref={ref}
                    markdown={markdown}
                    onChange={onChange}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    contentEditableClassName={contentClassName}
                    plugins={plugins}
                    className={darkMode ? 'dark-theme' : ''}
                />
            </div>
        );
    }
);

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;
