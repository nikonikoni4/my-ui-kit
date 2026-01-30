# Markdown 编辑器任务列表显示重叠问题总结

## 1. 问题抽象 (Problem Abstraction)

在集成第三方复杂 React 组件库（如富文本/Markdown 编辑器）时，经常会遇到 **“组件库默认样式与宿主环境样式冲突”** 以及 **“样式层叠/定位计算偏差”** 的问题。

这类问题的本质通常包括以下几点：
*   **负边距冲突 (Negative Margin Conflicts)**：组件库为了对齐效果，常使用负边距（如 `margin-inline-start: -1rem`）将装饰性元素（如复选框、列表符号）推到容器外，但如果宿主容器设置了 `overflow: hidden` 或特定的 `padding`，会导致这些元素重叠或消失。
*   **绝对定位对齐失效 (Absolute Positioning Misalignment)**：当装饰性元素使用 `position: absolute` 定位，而父元素行高 (`line-height`) 或字体大小发生变化时，如果定位基准点没有随之调整，就会出现垂直方向的错位。
*   **选择器优先级不足 (Selector Specificity)**：组件库内部可能使用了复杂的 CSS Modules 混淆类名，导致普通的全局 CSS 无法正确覆盖其内部样式。

---

## 2. 具体问题说明 (Specific Issues)

在当前的项目中，具体表现为 `MDXEditor` 组件生成的任务列表（Task List）中，复选框与文本内容发生重合。

### 2.1 技术根源分析
通过分析 `node_modules/@mdxeditor/editor/dist/style.css` 源码发现：
1.  **负边距导致挤压**：内部类名 `._listItemChecked_...` 使用了 `margin-inline-start: -1rem`，试图将复选框向左移动，但这与我们自定义的 `.md-content` 容器样式产生了冲突，导致文本被强制拉回到复选框的位置。
2.  **定位逻辑问题**：复选框伪元素 (`:before`) 使用了 `position: absolute`，但其 `top: 0` 的设置在 `line-height: 1.8` 的文本渲染下显得偏高，没有视觉居中。
3.  **解析语法错误**：原始 Markdown 内容中使用了 `[ ] 文本` 格式，而标准的 Markdown 任务列表语法要求必须带有列表符号，即 `- [ ] 文本`。

### 2.2 视觉表现
*   复选框盖在文本的首个字符上。
*   勾选后的删除线样式无法正确覆盖整个列表项。
*   在不同的缩放比例下，重叠程度不一。

---

## 3. 解决方案 (Solution Details)

我们采取了“样式覆盖”+“语法修正”的双重方案：

### 3.1 样式强制重置 (CSS Overrides)
在 `MarkdownEditor.css` 中，我们通过更高级级别的选择器（`!important`）重写了布局逻辑：
*   **取消负边距**：将 `margin-inline-start` 重置为 `0`。
*   **创建安全区**：使用 `padding-left: 28px` 为列表项左侧预留出固定空间。
*   **重新定位复选框**：将复选框伪元素定位在 `left: 0` 且 `top: 0.35em`（动态垂直居中）。
*   **重绘 UI**：手动定义了复选框的 `border`、`background` 和选中后的“勾选”标记（使用 `rotate(45deg)` 的边框模拟）。

### 3.2 规范内容输入
修正了 `App.tsx` 中的初始 Markdown 字符串，确保所有任务列表遵循 `- [ ]` 规范，从而激活组件库的正确定义类名。

---

## 4. 结论与建议
对于此类问题，建议在集成之初就通过开发者工具（F12）观察组件库生成的 DOM 结构。如果组件库使用了伪元素来实现 UI，**优先考虑将伪元素改为 `position: absolute` 并在父元素留足 `padding`**，这是最稳妥的兼容方案。
