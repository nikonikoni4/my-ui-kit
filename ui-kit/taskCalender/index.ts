/**
 * TaskCalendar 组件统一导出
 */

// ==================== 主组件 ====================
export { TaskCalendar, default } from './taskCalendar';

// ==================== 类型 ====================
export type {
    CalendarTask,
    CalendarDay,
    ViewMode,
    TaskCalendarProps,
    NavigationDirection,
} from './types';

// ==================== 工具函数 ====================
export {
    getDaysInMonth,
    getFirstDayOfMonth,
    isSameDay,
    isToday,
    getWeekDays,
    getMonthDays,
    formatMonthTitle,
    formatWeekRangeTitle,
    getNextMonth,
    getPrevMonth,
    getNextWeek,
    getPrevWeek,
} from './utils';

// ==================== 常量 ====================
export {
    WEEK_DAYS,
    WEEK_DAYS_EN,
    TASK_COLORS,
    CELL_HEIGHT,
    DEFAULT_CONFIG,
} from './constants';

// // ==================== Mock 数据（仅开发环境） ====================
// // 仅在开发环境导出 mock 数据
// if (import.meta.env.DEV) {
//     export { MOCK_TASKS } from './mockData';
// }
