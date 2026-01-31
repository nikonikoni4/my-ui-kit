/**
 * TodoItem 工具函数
 * 用于处理层级结构转换等操作（泛型版本）
 */

import { BaseTodoItem } from './types';

/**
 * 将扁平的 TodoItem 列表转换为树形结构
 * @param items - 扁平的 TodoItem 数组（需包含 parentId 字段）
 * @returns 构建好的树形结构（根节点的 parentId 为 null）
 */
export function flatListToTree<T extends BaseTodoItem & { parentId?: string | number | null; orderIndex?: number }>(
    items: T[]
): T[] {
    const itemMap = new Map<T['id'], T>();
    const roots: T[] = [];

    // 第一遍：创建所有项的映射，并初始化 children
    items.forEach(item => {
        itemMap.set(item.id, { ...item, children: [] as T[] });
    });

    // 第二遍：构建父子关系
    items.forEach(item => {
        const current = itemMap.get(item.id)!;
        if (item.parentId === null || item.parentId === undefined) {
            // 根节点
            roots.push(current);
        } else {
            // 子节点，找到父节点并添加
            const parent = itemMap.get(item.parentId as T['id']);
            if (parent) {
                parent.children = parent.children || [];
                (parent.children as T[]).push(current);
            } else {
                // 父节点不存在，作为根节点处理（数据异常容错）
                roots.push(current);
            }
        }
    });

    // 对每个层级按 orderIndex 排序
    const sortChildren = (items: T[]): T[] => {
        return items
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map(item => ({
                ...item,
                children: item.children ? sortChildren(item.children as T[]) : undefined
            }));
    };

    return sortChildren(roots);
}

/**
 * 将树形结构扁平化为列表
 * @param tree - 树形结构的 TodoItem 数组
 * @returns 扁平化的 TodoItem 数组
 */
export function treeToFlatList<T extends BaseTodoItem>(tree: T[]): T[] {
    const result: T[] = [];

    const traverse = (items: T[]) => {
        items.forEach(item => {
            const { children, ...itemWithoutChildren } = item;
            result.push(itemWithoutChildren as T);
            if (children && children.length > 0) {
                traverse(children as T[]);
            }
        });
    };

    traverse(tree);
    return result;
}

/**
 * 获取指定节点的所有后代 ID
 * @param item - 目标节点
 * @returns 包含该节点及其所有后代的 ID 数组
 */
export function getDescendantIds<T extends BaseTodoItem>(item: T): T['id'][] {
    const ids: T['id'][] = [item.id];

    if (item.children && item.children.length > 0) {
        (item.children as T[]).forEach(child => {
            ids.push(...getDescendantIds(child));
        });
    }

    return ids;
}

/**
 * 在树中查找指定 ID 的节点
 * @param tree - 树形结构
 * @param id - 目标节点 ID
 * @returns 找到的节点，或 undefined
 */
export function findItemById<T extends BaseTodoItem>(tree: T[], id: T['id']): T | undefined {
    for (const item of tree) {
        if (item.id === id) return item;
        if (item.children && item.children.length > 0) {
            const found = findItemById(item.children as T[], id);
            if (found) return found as T;
        }
    }
    return undefined;
}

/**
 * 计算节点的深度（层级）
 * @param items - 扁平列表（需包含 parentId 字段）
 * @param id - 目标节点 ID
 * @returns 深度（根节点为 0）
 */
export function getItemDepth<T extends BaseTodoItem & { parentId?: string | number | null }>(
    items: T[],
    id: T['id']
): number {
    const itemMap = new Map<T['id'], T>();
    items.forEach(item => itemMap.set(item.id, item));

    let depth = 0;
    let current = itemMap.get(id);

    while (current && current.parentId !== null && current.parentId !== undefined) {
        depth++;
        current = itemMap.get(current.parentId as T['id']);
    }

    return depth;
}
