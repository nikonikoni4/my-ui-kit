/**
 * Milestone 相关工具函数
 */

import { MilestoneItem, EditableMilestone } from './types';

/**
 * 将 MilestoneItem[] 转换为 EditableMilestone[]
 * 用于将展示数据转换为编辑器可用的格式
 */
export const convertToEditableMilestones = (milestones: MilestoneItem[]): EditableMilestone[] => {
    return milestones.map(m => ({
        id: m.id,
        content: m.content,
        orderIndex: m.orderIndex
    }));
};

/**
 * 将 EditableMilestone[] 转换为 JSON 字符串
 * 用于提交给后端 API
 */
export const convertMilestonesToJson = (milestones: EditableMilestone[]): string => {
    const obj: Record<string, { content: string; state: number; finish_time: null; order_index: number }> = {};
    milestones.forEach(m => {
        obj[m.id] = {
            content: m.content,
            state: 0,
            finish_time: null,
            order_index: m.orderIndex
        };
    });
    return JSON.stringify(obj);
};

/**
 * 将 EditableMilestone[] 转换为 JSON 字符串，同时保留已有里程碑的状态
 * 用于更新时保持已完成里程碑的状态
 */
export const convertMilestonesToJsonWithState = (
    milestones: EditableMilestone[],
    existingMilestones: MilestoneItem[]
): string => {
    const obj: Record<string, { content: string; state: number; finish_time: string | null; order_index: number }> = {};
    milestones.forEach(m => {
        const existing = existingMilestones.find(em => em.id === m.id);
        obj[m.id] = {
            content: m.content,
            state: existing?.state || 0,
            finish_time: existing?.finishTime || null,
            order_index: m.orderIndex
        };
    });
    return JSON.stringify(obj);
};
