import TaskItem from '@tiptap/extension-task-item';

/**
 * 扩展 TaskItem，添加 anchorId 属性用于保留 MD 中的锚点 ID
 *
 * 锚点格式：<!-- lp:t-xxxxxxxx -->
 * 存储为 data-anchor-id 属性
 */
export const TaskItemWithAnchor = TaskItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      anchorId: {
        default: null,
        keepOnSplit: false,
        parseHTML: element => element.getAttribute('data-anchor-id'),
        renderHTML: attributes => {
          if (!attributes.anchorId) {
            return {};
          }
          return {
            'data-anchor-id': attributes.anchorId,
          };
        },
      },
    };
  },
});
