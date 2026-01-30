/**
 * TaskCalendar 常量配置
 */

// ==================== 星期标签 ====================

/**
 * 星期标签（周日到周六）
 */
export const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const;

/**
 * 星期标签（英文简写）
 */
export const WEEK_DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

// ==================== 任务颜色预设 ====================

/**
 * 任务类型对应的颜色样式
 */
export const TASK_COLORS: Record<string, string> = {
    learning: 'bg-blue-400/30 border-blue-300/40',
    meeting: 'bg-purple-400/30 border-purple-300/40',
    design: 'bg-pink-400/30 border-pink-300/40',
    reading: 'bg-emerald-400/30 border-emerald-300/40',
    code: 'bg-orange-400/30 border-orange-300/40',
    release: 'bg-red-400/30 border-red-300/40',
    misc: 'bg-white/20 border-white/20',
    default: 'bg-white/10 border-white/10',
} as const;

// ==================== 视图配置 ====================

/**
 * 月视图网格行数（6 周）
 */
export const MONTH_VIEW_ROWS = 6;

/**
 * 月视图网格列数（7 天）
 */
export const MONTH_VIEW_COLS = 7;

/**
 * 月视图总格数
 */
export const MONTH_VIEW_CELLS = MONTH_VIEW_ROWS * MONTH_VIEW_COLS; // 42

/**
 * 周视图天数
 */
export const WEEK_VIEW_DAYS = 7;

// ==================== 样式配置 ====================

/**
 * 日期单元格高度类名
 */
export const CELL_HEIGHT = {
    month: 'h-36 md:h-40',
    week: 'min-h-[400px]',
} as const;

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
    /** 默认视图模式 */
    defaultViewMode: 'month' as const,
    /** 是否显示视图切换 */
    showViewToggle: true,
    /** 是否显示今天标签 */
    showTodayBadge: true,
    /** 动画持续时间（ms） */
    animationDuration: 300,
} as const;
