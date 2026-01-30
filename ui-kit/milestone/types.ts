/**
 * Milestone 组件相关类型定义
 * 可独立导出供其他项目使用
 */

// 里程碑展示类型（完整版，包含状态和完成时间）
export interface MilestoneItem {
    id: string;
    content: string;
    state: number;  // 0: 未达成, 1: 已达成
    finishTime: string | null;
    orderIndex: number;
}

// 编辑时使用的里程碑类型（不需要 state 和 finishTime）
export interface EditableMilestone {
    id: string;
    content: string;
    orderIndex: number;
}
