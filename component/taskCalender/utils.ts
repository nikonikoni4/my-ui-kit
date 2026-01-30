/**
 * TaskCalendar 工具函数
 */

import type { CalendarDay } from './types';

// ==================== 日期计算 ====================

/**
 * 获取指定月份的天数
 */
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * 获取指定月份第一天是星期几（0-6，0 表示周日）
 */
export function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

/**
 * 判断两个日期是否为同一天
 */
export function isSameDay(d1: Date, d2: Date): boolean {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

/**
 * 判断日期是否为今天
 */
export function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
}

// ==================== 日历网格生成 ====================

/**
 * 获取一周的日期数组（从周日开始）
 * @param baseDate - 基准日期（周内任意一天）
 * @returns 包含 7 天的日期数组
 */
export function getWeekDays(baseDate: Date): Date[] {
    const currentDay = baseDate.getDay();
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() - currentDay);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        days.push(d);
    }
    return days;
}

/**
 * 获取月视图的日期网格（包含前后补白）
 * @param baseDate - 基准日期（月内任意一天）
 * @returns 包含 42 个日期项的数组（6 周 × 7 天）
 */
export function getMonthDays(baseDate: Date): CalendarDay[] {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: CalendarDay[] = [];

    // 前补白（上个月的日期）
    for (let i = 0; i < firstDay; i++) {
        const d = new Date(year, month, 1 - (firstDay - i));
        days.push({ date: d, isCurrentMonth: false });
    }

    // 当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        days.push({ date: d, isCurrentMonth: true });
    }

    // 后补白（下个月的日期，补齐到 42 格）
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({ date: d, isCurrentMonth: false });
    }

    return days;
}

// ==================== 日期格式化 ====================

/**
 * 格式化月份标题（如：2026年1月）
 */
export function formatMonthTitle(date: Date, locale: string = 'zh-CN'): string {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long'
    }).format(date);
}

/**
 * 格式化周范围标题（如：1日 - 7日）
 */
export function formatWeekRangeTitle(baseDate: Date): string {
    const days = getWeekDays(baseDate);
    return `${days[0].getDate()}日 - ${days[6].getDate()}日`;
}

// ==================== 日期导航 ====================

/**
 * 获取下一个月的日期
 */
export function getNextMonth(date: Date): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
}

/**
 * 获取上一个月的日期
 */
export function getPrevMonth(date: Date): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    return newDate;
}

/**
 * 获取下一周的日期
 */
export function getNextWeek(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7);
    return newDate;
}

/**
 * 获取上一周的日期
 */
export function getPrevWeek(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 7);
    return newDate;
}
