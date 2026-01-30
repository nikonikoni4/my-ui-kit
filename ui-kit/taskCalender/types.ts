/**
 * TaskCalendar 组件相关类型定义
 */

// ==================== 数据类型 ====================

/**
 * 日历任务项
 */
export interface CalendarTask {
    id: number | string;
    title: string;
    date: Date;
    type?: string;
    color?: string;
}

/**
 * 日历日期项（用于渲染）
 */
export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
}

// ==================== 组件 Props ====================

/**
 * 视图模式
 */
export type ViewMode = 'month' | 'week';

/**
 * TaskCalendar 主组件 Props
 */
export interface TaskCalendarProps {
    /** 外部样式类名 */
    className?: string;

    /** 任务数据源 */
    tasks?: CalendarTask[];

    /** 初始视图模式 */
    defaultViewMode?: ViewMode;

    /** 初始选中日期 */
    defaultSelectedDate?: Date;

    /** 是否显示视图切换按钮 */
    showViewToggle?: boolean;

    /** 是否显示"今天"标签 */
    showTodayBadge?: boolean;

    /** 日期选中回调 */
    onDateSelect?: (date: Date) => void;

    /** 任务点击回调 */
    onTaskClick?: (task: CalendarTask, date: Date) => void;

    /** 空白日期点击回调（用于添加任务） */
    onEmptyDateClick?: (date: Date) => void;

    /** 自定义任务渲染 */
    renderTask?: (task: CalendarTask) => React.ReactNode;

    /** 自定义空状态渲染 */
    renderEmptyState?: (date: Date) => React.ReactNode;
}

// ==================== 工具类型 ====================

/**
 * 日期导航方向
 */
export type NavigationDirection = -1 | 0 | 1;
