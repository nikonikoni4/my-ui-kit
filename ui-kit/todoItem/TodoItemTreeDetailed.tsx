import React, { useState, useCallback, useEffect } from 'react';
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
import { BaseTodoItem, TodoItemTreeDetailedProps } from './types';
import { TodoItemDetailed } from './TodoItemDetailed';

// ============================================================================
// Constants
// ============================================================================

const INDENT_PX = 28; // 每层缩进像素

// ============================================================================
// Internal Types
// ============================================================================

interface TodoItemNodeDetailedProps<T extends BaseTodoItem> {
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
    showSource?: boolean;
    showDate?: boolean;
    renderTag?: (item: T) => React.ReactNode;
    renderExtra?: (item: T) => React.ReactNode;
    renderActions?: (item: T) => React.ReactNode;
    renderTimeInfo?: (item: T) => React.ReactNode;
    renderChildren: () => React.ReactNode;
    onAddChild?: (parentId: T['id']) => void;
    goalName?: string;
    planName?: string;
}

// ============================================================================
// Sub Components
// ============================================================================

/**
 * 单个树节点（包含展开/折叠按钮和子节点渲染）
 * 使用 TodoItemDetailed 组件渲染详细版本
 */
function TodoItemNodeDetailed<T extends BaseTodoItem>({
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
    showSource,
    showDate,
    renderTag,
    renderExtra,
    renderActions,
    renderTimeInfo,
    renderChildren,
    onAddChild,
    goalName,
    planName,
}: TodoItemNodeDetailedProps<T>) {
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
                        className="mt-4 p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
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

                {/* TodoItemDetailed 组件 */}
                <div className="flex-1 min-w-0">
                    <TodoItemDetailed<T>
                        item={item}
                        isActive={selectedId === item.id}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onSelect={onSelect}
                        showSource={showSource}
                        showDate={showDate}
                        onAddChild={onAddChild}
                        goalName={goalName}
                        planName={planName}
                        renderTag={renderTag}
                        renderExtra={renderExtra}
                        renderActions={renderActions}
                        renderTimeInfo={renderTimeInfo}
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
 * TodoItemTreeDetailed - 递归渲染层级结构的容器组件（详细版本，泛型）
 *
 * 专门用于每日聚焦页面，使用 TodoItemDetailed 组件渲染每个节点
 * 直接展示时间信息（开始时间、预期完成、拖延状态等）
 *
 * 支持：
 * - 无限层级嵌套
 * - 展开/折叠
 * - 可选的拖拽排序
 * - 连接线视觉效果
 * - 详细时间信息展示
 * - Render Props 插槽
 */
export function TodoItemTreeDetailed<T extends BaseTodoItem = BaseTodoItem>({
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
    showSource = true,
    showDate = true,
    onAddChild,
    getGoalName,
    getPlanName,
    renderTag,
    renderExtra,
    renderActions,
    renderTimeInfo,
}: TodoItemTreeDetailedProps<T>) {
    // 展开状态管理
    const [expandedIds, setExpandedIds] = useState<Set<number | string>>(() => {
        return defaultExpandedIds || new Set();
    });

    // 同步外部传入的 defaultExpandedIds 变化
    useEffect(() => {
        if (defaultExpandedIds) {
            setExpandedIds(defaultExpandedIds);
        }
    }, [defaultExpandedIds]);

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
        return itemList.map(item => {
            // Type-safe access to optional properties for goal/plan names
            const itemAny = item as any;
            const goalId = itemAny.goalId as string | null | undefined;
            const planDocId = itemAny.planDocId as string | null | undefined;

            return (
                <TodoItemNodeDetailed<T>
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
                    showSource={showSource}
                    showDate={showDate}
                    onAddChild={onAddChild}
                    goalName={getGoalName?.(goalId ?? null)}
                    planName={getPlanName?.(planDocId ?? null)}
                    renderTag={renderTag}
                    renderExtra={renderExtra}
                    renderActions={renderActions}
                    renderTimeInfo={renderTimeInfo}
                    renderChildren={() =>
                        item.children && item.children.length > 0
                            ? renderItems(item.children as T[], currentLevel + 1)
                            : null
                    }
                />
            );
        });
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
