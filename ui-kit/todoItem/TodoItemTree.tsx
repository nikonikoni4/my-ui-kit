import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BaseTodoItem, TodoItemTreeProps } from './types';
import { TodoItem } from './TodoItem';

// ============================================================================
// Constants
// ============================================================================

const INDENT_PX = 28; // 每层缩进像素

// ============================================================================
// Internal Types
// ============================================================================

interface TodoItemNodeProps<T extends BaseTodoItem> {
    item: T;
    level: number;
    maxIndentLevel: number;
    collapsible: boolean;
    isExpanded: boolean;
    selectedId?: number | string | null;
    onToggleExpand: (id: T['id']) => void;
    onUpdate?: (id: T['id'], updates: Partial<T>) => void;
    onDelete?: (id: T['id']) => void;
    onSelect?: (id: T['id']) => void;
    showDate?: boolean;
    renderTag?: (item: T) => React.ReactNode;
    renderExtra?: (item: T) => React.ReactNode;
    renderActions?: (item: T) => React.ReactNode;
    renderChildren: () => React.ReactNode;
}

// ============================================================================
// Sub Components
// ============================================================================

/**
 * 单个树节点（包含展开/折叠按钮和子节点渲染）
 */
function TodoItemNode<T extends BaseTodoItem>({
    item,
    level,
    maxIndentLevel,
    collapsible,
    isExpanded,
    selectedId,
    onToggleExpand,
    onUpdate,
    onDelete,
    onSelect,
    showDate,
    renderTag,
    renderExtra,
    renderActions,
    renderChildren,
}: TodoItemNodeProps<T>) {
    const hasChildren = item.children && item.children.length > 0;
    const indent = Math.min(level, maxIndentLevel) * INDENT_PX;

    return (
        <div className="relative">
            {/* 连接线（可选，增加视觉层级感） */}
            {level > 0 && (
                <div
                    className="absolute top-0 bottom-0 border-l-2 border-slate-200/60"
                    style={{ left: indent - INDENT_PX / 2 - 1 }}
                />
            )}

            <div
                className="flex items-start gap-1"
                style={{ paddingLeft: indent }}
            >
                {/* 展开/折叠按钮 */}
                {collapsible && hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(item.id);
                        }}
                        className="mt-3 p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                    >
                        {isExpanded ? (
                            <ChevronDown size={16} />
                        ) : (
                            <ChevronRight size={16} />
                        )}
                    </button>
                ) : (
                    // 占位符，保持对齐
                    <div className="w-5 flex-shrink-0" />
                )}

                {/* TodoItem 组件 */}
                <div className="flex-1 min-w-0">
                    <TodoItem<T>
                        item={item}
                        isActive={selectedId === item.id}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onSelect={onSelect}

                        showDate={showDate}
                        renderTag={renderTag}
                        renderExtra={renderExtra}
                        renderActions={renderActions}
                    />
                </div>
            </div>

            {/* 子节点 */}
            {hasChildren && isExpanded && (
                <div className="relative">
                    {renderChildren()}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * TodoItemTree - 递归渲染层级结构的容器组件（泛型版本）
 *
 * 支持：
 * - 无限层级嵌套
 * - 展开/折叠
 * - 可选的拖拽排序
 * - 连接线视觉效果
 * - Render Props 插槽
 */
export function TodoItemTree<T extends BaseTodoItem = BaseTodoItem>({
    items,
    level = 0,
    maxIndentLevel = 5,
    collapsible = true,
    defaultExpandedIds,
    sortable = false,
    selectedId,
    onUpdate,
    onDelete,
    onSelect,
    onDragEnd,
    onExpandChange,
    showDate = true,
    renderTag,
    renderExtra,
    renderActions,
}: TodoItemTreeProps<T>) {
    // 展开状态管理
    const [expandedIds, setExpandedIds] = useState<Set<number | string>>(() => {
        return defaultExpandedIds || new Set();
    });

    const toggleExpand = useCallback((id: T['id']) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            const willExpand = !next.has(id);
            if (willExpand) {
                next.add(id);
            } else {
                next.delete(id);
            }
            onExpandChange?.(id, willExpand);
            return next;
        });
    }, [onExpandChange]);

    // 拖拽传感器配置
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 递归渲染子节点
    const renderItems = (itemList: T[], currentLevel: number) => {
        return itemList.map(item => (
            <TodoItemNode<T>
                key={item.id}
                item={item}
                level={currentLevel}
                maxIndentLevel={maxIndentLevel}
                collapsible={collapsible}
                isExpanded={expandedIds.has(item.id)}
                selectedId={selectedId}
                onToggleExpand={toggleExpand}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onSelect={onSelect}

                showDate={showDate}
                renderTag={renderTag}
                renderExtra={renderExtra}
                renderActions={renderActions}
                renderChildren={() =>
                    item.children && item.children.length > 0
                        ? renderItems(item.children as T[], currentLevel + 1)
                        : null
                }
            />
        ));
    };

    // 如果启用排序，包裹 DndContext
    if (sortable && level === 0) {
        const allIds = items.map(item => item.id);

        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
            >
                <SortableContext
                    items={allIds}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-0">
                        {renderItems(items, level)}
                    </div>
                </SortableContext>
            </DndContext>
        );
    }

    return (
        <div className="space-y-0">
            {renderItems(items, level)}
        </div>
    );
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * 用于管理展开状态的 Hook
 * 可在页面级使用，提供更细粒度的控制
 */
export function useExpandedState(initialIds: (number | string)[] = []) {
    const [expandedIds, setExpandedIds] = useState<Set<number | string>>(
        () => new Set(initialIds)
    );

    const expand = useCallback((id: number | string) => {
        setExpandedIds(prev => new Set([...prev, id]));
    }, []);

    const collapse = useCallback((id: number | string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }, []);

    const toggle = useCallback((id: number | string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const expandAll = useCallback((ids: (number | string)[]) => {
        setExpandedIds(new Set(ids));
    }, []);

    const collapseAll = useCallback(() => {
        setExpandedIds(new Set());
    }, []);

    return {
        expandedIds,
        expand,
        collapse,
        toggle,
        expandAll,
        collapseAll,
        isExpanded: (id: number | string) => expandedIds.has(id),
    };
}
