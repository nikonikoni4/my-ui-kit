/**
 * Milestone 组件模块统一导出入口
 * 
 * 使用示例：
 * ```tsx
 * import { MilestoneEditor, MilestoneAxis, MilestoneItem, EditableMilestone } from '@/other_project/milestone';
 * 
 * // 或者单独导入
 * import MilestoneEditor from '@/other_project/milestone/MilestoneEditor';
 * import MilestoneAxis from '@/other_project/milestone/MilestoneAxis';
 * ```
 */

// 类型导出
export type { MilestoneItem, EditableMilestone } from './types';

// 组件导出
export { default as MilestoneEditor, SortableMilestoneEditItem } from './MilestoneEditor';
export type { MilestoneEditorProps } from './MilestoneEditor';

export { default as MilestoneAxis } from './MilestoneAxis';
export type { MilestoneAxisProps } from './MilestoneAxis';

// 工具函数导出
export { convertToEditableMilestones, convertMilestonesToJson } from './utils';
