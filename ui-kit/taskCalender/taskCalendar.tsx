import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

import type { TaskCalendarProps, ViewMode, CalendarTask } from './types';
import {
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
import { WEEK_DAYS, DEFAULT_CONFIG } from './constants';

/**
 * TaskCalendar - 高复用性任务日历组件
 * 
 * 特性:
 * - 支持月视图和周视图切换
 * - 支持自定义任务数据源
 * - 支持自定义渲染函数
 * - 完整的事件回调系统
 * - 磨砂玻璃设计风格
 * 
 * @example
 * ```tsx
 * <TaskCalendar
 *   tasks={myTasks}
 *   onDateSelect={(date) => console.log(date)}
 *   onTaskClick={(task) => console.log(task)}
 * />
 * ```
 */
export const TaskCalendar: React.FC<TaskCalendarProps> = ({
    className = '',
    tasks = [],
    defaultViewMode = DEFAULT_CONFIG.defaultViewMode,
    defaultSelectedDate = new Date(),
    showViewToggle = DEFAULT_CONFIG.showViewToggle,
    showTodayBadge = DEFAULT_CONFIG.showTodayBadge,
    onDateSelect,
    onTaskClick,
    onEmptyDateClick,
    renderTask,
    renderEmptyState,
}) => {
    // ==================== State ====================
    const [currentDate, setCurrentDate] = useState(defaultSelectedDate);
    const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
    const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);

    // ==================== Handlers ====================

    /**
     * 导航到上一个时间段
     */
    const handlePrev = () => {
        const newDate = viewMode === 'month'
            ? getPrevMonth(currentDate)
            : getPrevWeek(currentDate);
        setCurrentDate(newDate);
    };

    /**
     * 导航到下一个时间段
     */
    const handleNext = () => {
        const newDate = viewMode === 'month'
            ? getNextMonth(currentDate)
            : getNextWeek(currentDate);
        setCurrentDate(newDate);
    };

    /**
     * 处理日期点击
     */
    const handleDateClick = (date: Date) => {
        setSelectedDate(date);

        // 如果点击的是非当前月的日期,自动切换到该月
        if (viewMode === 'month' && date.getMonth() !== currentDate.getMonth()) {
            setCurrentDate(date);
        }

        onDateSelect?.(date);
    };

    /**
     * 处理任务点击
     */
    const handleTaskClick = (task: CalendarTask, date: Date, e: React.MouseEvent) => {
        e.stopPropagation(); // 防止触发日期点击
        onTaskClick?.(task, date);
    };

    /**
     * 处理空白日期点击（用于添加任务）
     */
    const handleEmptyClick = (date: Date, e: React.MouseEvent) => {
        e.stopPropagation();
        onEmptyDateClick?.(date);
    };

    // ==================== Computed Values ====================

    /**
     * 日历网格数据
     */
    const calendarGrid = useMemo(() => {
        if (viewMode === 'week') {
            return getWeekDays(currentDate).map(d => ({ date: d, isCurrentMonth: true }));
        } else {
            return getMonthDays(currentDate);
        }
    }, [currentDate, viewMode]);

    /**
     * 标题文本
     */
    const headerTitle = formatMonthTitle(currentDate);

    /**
     * 周范围标题（仅周视图）
     */
    const weekRangeTitle = viewMode === 'week' ? formatWeekRangeTitle(currentDate) : null;

    /**
     * 获取指定日期的任务列表
     */
    const getTasksForDate = (date: Date): CalendarTask[] => {
        return tasks.filter(task => isSameDay(task.date, date));
    };

    // ==================== Render ====================

    /**
     * 渲染单个任务
     */
    const renderTaskItem = (task: CalendarTask, date: Date) => {
        if (renderTask) {
            return renderTask(task);
        }

        return (
            <div
                key={task.id}
                onClick={(e) => handleTaskClick(task, date, e)}
                className={`
                    w-full rounded-md border p-1.5 text-xs text-white backdrop-blur-sm shadow-sm
                    transition-transform hover:scale-[1.02] cursor-pointer flex-shrink-0
                    ${task.color || 'bg-white/10 border-white/10'}
                `}
            >
                <div className="line-clamp-2 font-medium opacity-90">{task.title}</div>
            </div>
        );
    };

    /**
     * 渲染空状态
     */
    const renderEmpty = (date: Date) => {
        if (renderEmptyState) {
            return renderEmptyState(date);
        }

        return (
            <div
                onClick={(e) => handleEmptyClick(date, e)}
                className="mt-2 h-full w-full rounded-lg border-2 border-dashed border-white/5 opacity-0 transition-opacity group-hover/cell:opacity-100 flex items-center justify-center flex-shrink-0 min-h-[40px] cursor-pointer"
            >
                <span className="text-xs text-white/20">+ 添加</span>
            </div>
        );
    };

    return (
        <div className={`relative group isolate w-full max-w-5xl mx-auto ${className}`}>
            {/* 隐藏滚动条样式 */}
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* 磨砂玻璃容器 */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-500">

                {/* 顶部反光效果 */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* ==================== Header ==================== */}
                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    {/* 左侧：导航 + 标题 */}
                    <div className="flex items-center gap-6">
                        {/* 导航按钮 */}
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                className="group/btn flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:scale-105 hover:bg-white/20 active:scale-95 transition-all"
                                aria-label="上一个"
                            >
                                <ChevronLeft className="h-6 w-6 opacity-70 group-hover/btn:opacity-100" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="group/btn flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:scale-105 hover:bg-white/20 active:scale-95 transition-all"
                                aria-label="下一个"
                            >
                                <ChevronRight className="h-6 w-6 opacity-70 group-hover/btn:opacity-100" />
                            </button>
                        </div>

                        {/* 标题 */}
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg font-sans">
                                {headerTitle}
                            </h2>
                            {viewMode === 'week' && weekRangeTitle && (
                                <span className="text-sm font-medium tracking-wide text-blue-200/80 uppercase">
                                    {weekRangeTitle}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 右侧：视图切换 */}
                    {showViewToggle && (
                        <div className="relative flex rounded-xl border border-white/10 bg-black/20 p-1.5 backdrop-blur-md">
                            {/* 滑动背景 */}
                            <div
                                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-lg bg-white/20 shadow-lg transition-all duration-300 ease-out ${viewMode === 'week' ? 'translate-x-0' : 'translate-x-[100%] ml-1.5'
                                    }`}
                            />

                            {/* 周视图按钮 */}
                            <button
                                onClick={() => setViewMode('week')}
                                className={`relative z-10 flex w-28 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors duration-300 ${viewMode === 'week' ? 'text-white' : 'text-white/50 hover:text-white/80'
                                    }`}
                            >
                                <Clock className="h-4 w-4" />
                                <span>周视图</span>
                            </button>

                            {/* 月视图按钮 */}
                            <button
                                onClick={() => setViewMode('month')}
                                className={`relative z-10 flex w-28 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors duration-300 ${viewMode === 'month' ? 'text-white' : 'text-white/50 hover:text-white/80'
                                    }`}
                            >
                                <CalendarIcon className="h-4 w-4" />
                                <span>月视图</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* ==================== Calendar Grid ==================== */}
                <div className="w-full">
                    {/* 星期标题 */}
                    <div className="mb-4 grid grid-cols-7 text-center">
                        {WEEK_DAYS.map((day) => (
                            <div key={day} className="text-sm font-bold uppercase tracking-widest text-white/50">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* 日期网格 */}
                    <div className={`grid grid-cols-7 gap-3 transition-all duration-500 ease-in-out ${viewMode === 'month' ? 'auto-rows-[9rem] md:auto-rows-[10rem]' : ''}`}>
                        {calendarGrid.map((item, index) => {
                            const isActive = isSameDay(item.date, selectedDate);
                            const isTodayDate = isToday(item.date);
                            const dayTasks = getTasksForDate(item.date);

                            return (
                                <div
                                    key={index}
                                    onClick={() => handleDateClick(item.date)}
                                    className={`
                                        group/cell relative flex flex-col items-start justify-start rounded-2xl border border-white/5 p-3 transition-all duration-300 cursor-pointer overflow-hidden
                                        ${viewMode === 'week' ? 'min-h-[400px]' : 'h-full'}
                                        ${!item.isCurrentMonth && viewMode === 'month' ? 'bg-black/5 opacity-40' : 'bg-white/5'}
                                        ${isActive
                                            ? 'ring-1 ring-blue-400/50 bg-white/10 shadow-[0_0_15px_rgba(59,130,246,0.2)] z-10'
                                            : 'hover:bg-white/10 hover:border-white/20'
                                        }
                                    `}
                                >
                                    {/* 日期数字 + 今天标签 */}
                                    <div className="flex w-full items-center justify-between mb-2 flex-shrink-0">
                                        <span className={`text-base font-semibold ${isActive || isTodayDate ? 'text-white' : 'text-white/60 group-hover/cell:text-white'
                                            }`}>
                                            {item.date.getDate()}
                                        </span>
                                        {showTodayBadge && isTodayDate && (
                                            <span className="flex h-6 w-auto px-2 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-lg">
                                                今天
                                            </span>
                                        )}
                                    </div>

                                    {/* 任务列表区域 */}
                                    <div className="w-full flex-1 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden no-scrollbar min-h-0">
                                        {dayTasks.map((task) => renderTaskItem(task, item.date))}

                                        {/* 空状态 */}
                                        {dayTasks.length === 0 && renderEmpty(item.date)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCalendar;