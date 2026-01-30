/**
 * TaskCalendar 模拟数据（仅用于开发和测试）
 */

import type { CalendarTask } from './types';

/**
 * 模拟任务数据
 */
export const MOCK_TASKS: CalendarTask[] = [
    {
        id: 1,
        title: 'React 深度研读',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
        type: 'learning',
        color: 'bg-blue-400/30 border-blue-300/40'
    },
    {
        id: 2,
        title: '完成官方教程',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
        type: 'learning',
        color: 'bg-blue-400/30 border-blue-300/40'
    },
    {
        id: 3,
        title: '项目周会',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
        type: 'meeting',
        color: 'bg-purple-400/30 border-purple-300/40'
    },
    {
        id: 4,
        title: 'UI 设计评审',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
        type: 'design',
        color: 'bg-pink-400/30 border-pink-300/40'
    },
    {
        id: 5,
        title: '阅读 CSAPP 第3章',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 12),
        type: 'reading',
        color: 'bg-emerald-400/30 border-emerald-300/40'
    },
    {
        id: 6,
        title: '系统架构重构',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
        type: 'code',
        color: 'bg-orange-400/30 border-orange-300/40'
    },
    {
        id: 7,
        title: '发布 v2.0 版本',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 28),
        type: 'release',
        color: 'bg-red-400/30 border-red-300/40'
    },
    {
        id: 8,
        title: '编写测试用例',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 28),
        type: 'code',
        color: 'bg-orange-400/30 border-orange-300/40'
    },
    {
        id: 9,
        title: '整理任务池',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        type: 'misc',
        color: 'bg-white/20 border-white/20'
    },
];
