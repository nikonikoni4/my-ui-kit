/**
 * TodoItem 组件相关类型定义
 * 泛型设计：定义最小渲染接口 + render props 插槽
 */

// ============================================================================
// Base Interface - 最小渲染接口
// ============================================================================

/**
 * 渲染 TodoItem 的最小接口
 * 业务层可以扩展此接口添加更多字段
 */
export interface BaseTodoItem {
    id: number | string;
    content: string;
    state?: string;
    color?: string;
    children?: BaseTodoItem[];
}

// ============================================================================
// Component Props - 泛型 Props
// ============================================================================

/**
 * TodoItem 组件 Props（基础版本）
 */
export interface TodoItemProps<T extends BaseTodoItem = BaseTodoItem> {
    /** 任务数据 */
    item: T;
    /** 是否选中 */
    isActive?: boolean;
    /** 更新回调 */
    onUpdate?: (id: T['id'], updates: Partial<T>) => void;
    /** 选择回调 */
    onSelect?: (id: T['id']) => void;
    /** 删除回调 */
    onDelete?: (id: T['id']) => void;

    // === Render Props 插槽 ===
    /** 自定义标签渲染（如目标标签、计划标签） */
    renderTag?: (item: T) => React.ReactNode;
    /** 自定义额外内容渲染 */
    renderExtra?: (item: T) => React.ReactNode;
    /** 自定义操作按钮渲染 */
    renderActions?: (item: T) => React.ReactNode;

    // === 显示控制 ===
    /** 是否显示日期标签 */
    showDate?: boolean;
    /** 是否显示编辑按钮 */
    showEditButton?: boolean;

    // === 拖拽相关 ===
    /** 拖拽项类型 */
    dragType?: string;
    /** 拖拽来源 */
    dragSource?: string;
    /** 禁用内部 sortable */
    disableSortable?: boolean;

    // === 样式 ===
    /** 禁用卡片样式（边框、阴影、左边框），用于嵌入自定义容器时 */
    disableCardStyle?: boolean;
    className?: string;
}

/**
 * TodoItemDetailed 组件 Props（详细版本）
 */
export interface TodoItemDetailedProps<T extends BaseTodoItem = BaseTodoItem> {
    /** 任务数据 */
    item: T;
    /** 是否选中 */
    isActive?: boolean;
    /** 更新回调 */
    onUpdate?: (id: T['id'], updates: Partial<T>) => void;
    /** 选择回调 */
    onSelect?: (id: T['id']) => void;
    /** 删除回调 */
    onDelete?: (id: T['id']) => void;
    /** 添加子项回调 */
    onAddChild?: (parentId: T['id']) => void;

    // === Render Props 插槽 ===
    /** 自定义标签渲染 */
    renderTag?: (item: T) => React.ReactNode;
    /** 自定义额外内容渲染 */
    renderExtra?: (item: T) => React.ReactNode;
    /** 自定义操作按钮渲染 */
    renderActions?: (item: T) => React.ReactNode;
    /** 自定义时间信息渲染 */
    renderTimeInfo?: (item: T) => React.ReactNode;

    // === 显示控制 ===
    showDate?: boolean;

    // === 外部数据（可选，用于显示关联信息） ===
    goalName?: string;
    planName?: string;

    // === 样式 ===
    className?: string;
}

/**
 * TodoItemTree 组件 Props
 */
export interface TodoItemTreeProps<T extends BaseTodoItem = BaseTodoItem>
    extends Omit<TodoItemProps<T>, 'item' | 'isActive'> {
    /** 树形结构的 TodoItem 数组 */
    items: T[];
    /** 当前层级（内部递归使用） */
    level?: number;
    /** 最大缩进层级 */
    maxIndentLevel?: number;
    /** 是否支持折叠 */
    collapsible?: boolean;
    /** 初始展开的节点 ID 集合 */
    defaultExpandedIds?: Set<number | string>;
    /** 是否启用拖拽排序 */
    sortable?: boolean;
    /** 选中的任务 ID */
    selectedId?: number | string | null;
    /** 拖拽结束回调 */
    onDragEnd?: (event: any) => void;
    /** 展开/折叠变化回调 */
    onExpandChange?: (id: T['id'], expanded: boolean) => void;
}

/**
 * TodoItemTreeDetailed 组件 Props
 */
export interface TodoItemTreeDetailedProps<T extends BaseTodoItem = BaseTodoItem>
    extends Omit<TodoItemDetailedProps<T>, 'item' | 'isActive'> {
    /** 树形结构的 TodoItem 数组 */
    items: T[];
    /** 当前层级（内部递归使用） */
    level?: number;
    /** 最大缩进层级 */
    maxIndentLevel?: number;
    /** 是否支持折叠 */
    collapsible?: boolean;
    /** 初始展开的节点 ID 集合 */
    defaultExpandedIds?: Set<number | string>;
    /** 是否启用拖拽排序 */
    sortable?: boolean;
    /** 选中的任务 ID */
    selectedId?: number | string | null;
    /** 拖拽结束回调 */
    onDragEnd?: (event: any) => void;
    /** 展开/折叠变化回调 */
    onExpandChange?: (id: T['id'], expanded: boolean) => void;
    /** 根据 goalId 获取 Goal 名称 */
    getGoalName?: (goalId: string | null) => string | undefined;
    /** 根据 planDocId 获取 Plan 名称 */
    getPlanName?: (planDocId: string | null) => string | undefined;
}

// ============================================================================
// Legacy Types - 向后兼容（已废弃，请使用 BaseTodoItem）
// ============================================================================

/**
 * @deprecated 请使用 BaseTodoItem 并在业务层扩展
 * 保留此类型仅为向后兼容
 */
export interface TodoItem extends BaseTodoItem {
    id: string;
    content: string;
    parentId: string | null;
    goalId: string | null;
    planDocId: string | null;
    state: 'pool' | 'scheduled' | 'completed' | 'shelved';
    scheduledDate: string | null;
    expectedFinishAt: string | null;
    actualFinishAt: string | null;
    delayDays: number | null;
    delayReason: string | null;
    color: string;
    orderIndex: number;
    poolOrderIndex: number | null;
    children?: TodoItem[];
}
