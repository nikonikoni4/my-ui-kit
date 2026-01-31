// Components - Basic version (for Task Pool and Task Assignment)
export { TodoItem, TODO_COLORS, getRandomColor } from './TodoItem';
export { TodoItemTree, useExpandedState } from './TodoItemTree';

// Components - Detailed version (for Daily Focus)
export { TodoItemDetailed } from './TodoItemDetailed';
export { TodoItemTreeDetailed } from './TodoItemTreeDetailed';

// Types
export type {
    BaseTodoItem,
    TodoItem as TodoItemType,
    TodoItemProps,
    TodoItemDetailedProps,
    TodoItemTreeProps,
    TodoItemTreeDetailedProps,
} from './types';

// Utilities
export {
    flatListToTree,
    treeToFlatList,
    getDescendantIds,
    findItemById,
    getItemDepth,
} from './utils';
