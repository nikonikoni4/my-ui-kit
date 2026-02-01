import { Node, mergeAttributes } from '@tiptap/core';

export interface TaskListContainerOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    taskListContainer: {
      insertTaskBlock: () => ReturnType;
    };
  }
}

export const TaskListContainer = Node.create<TaskListContainerOptions>({
  name: 'taskListContainer',
  group: 'block',
  content: 'taskList+',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="task-block"]' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'task-block',
        class: 'task-block-container',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertTaskBlock: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [
            {
              type: 'taskList',
              content: [
                {
                  type: 'taskItem',
                  attrs: { checked: false },
                  content: [{ type: 'paragraph' }],
                },
              ],
            },
          ],
        });
      },
    };
  },
});
