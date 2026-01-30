# TaskCalendar 组件使用文档

## 📋 概述

`TaskCalendar` 是一个高复用性的任务日历组件，采用磨砂玻璃设计风格，支持月视图和周视图切换。

## 🎯 特性

- ✅ **双视图模式**：支持月视图和周视图切换
- ✅ **自定义数据源**：可传入任意任务数据
- ✅ **完整回调系统**：日期选择、任务点击、空白点击等事件
- ✅ **自定义渲染**：支持自定义任务和空状态渲染
- ✅ **响应式设计**：适配不同屏幕尺寸
- ✅ **磨砂玻璃风格**：现代化 UI 设计

## 📦 安装

组件位于项目内部，直接导入即可：

\`\`\`typescript
import { TaskCalendar } from '@/other_project/taskCalender';
import type { CalendarTask } from '@/other_project/taskCalender';
\`\`\`

## 🚀 快速开始

### 基础用法

\`\`\`tsx
import { TaskCalendar } from '@/other_project/taskCalender';

function MyPage() {
    return (
        <TaskCalendar
            onDateSelect={(date) => console.log('选中日期:', date)}
        />
    );
}
\`\`\`

### 带任务数据

\`\`\`tsx
import { TaskCalendar, type CalendarTask } from '@/other_project/taskCalender';

function MyPage() {
    const tasks: CalendarTask[] = [
        {
            id: 1,
            title: 'React 学习',
            date: new Date(2026, 0, 15),
            type: 'learning',
            color: 'bg-blue-400/30 border-blue-300/40',
        },
        {
            id: 2,
            title: '项目会议',
            date: new Date(2026, 0, 20),
            type: 'meeting',
            color: 'bg-purple-400/30 border-purple-300/40',
        },
    ];

    return (
        <TaskCalendar
            tasks={tasks}
            onDateSelect={(date) => console.log('选中:', date)}
            onTaskClick={(task) => console.log('点击任务:', task)}
        />
    );
}
\`\`\`

## 📖 API 文档

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `className` | `string` | `''` | 外部样式类名 |
| `tasks` | `CalendarTask[]` | `[]` | 任务数据源 |
| `defaultViewMode` | `'month' \| 'week'` | `'month'` | 初始视图模式 |
| `defaultSelectedDate` | `Date` | `new Date()` | 初始选中日期 |
| `showViewToggle` | `boolean` | `true` | 是否显示视图切换按钮 |
| `showTodayBadge` | `boolean` | `true` | 是否显示"今天"标签 |
| `onDateSelect` | `(date: Date) => void` | - | 日期选中回调 |
| `onTaskClick` | `(task: CalendarTask, date: Date) => void` | - | 任务点击回调 |
| `onEmptyDateClick` | `(date: Date) => void` | - | 空白日期点击回调 |
| `renderTask` | `(task: CalendarTask) => ReactNode` | - | 自定义任务渲染 |
| `renderEmptyState` | `(date: Date) => ReactNode` | - | 自定义空状态渲染 |

### CalendarTask 类型

\`\`\`typescript
interface CalendarTask {
    id: number | string;      // 任务 ID
    title: string;           // 任务标题
    date: Date;              // 任务日期
    type?: string;           // 任务类型（可选）
    color?: string;          // 任务颜色（Tailwind 类名）
}
\`\`\`

## 💡 使用示例

### 1. 自定义任务渲染

\`\`\`tsx
<TaskCalendar
    tasks={tasks}
    renderTask={(task) => (
        <div className="custom-task-card">
            <span className="task-icon">{task.type}</span>
            <span className="task-title">{task.title}</span>
        </div>
    )}
/>
\`\`\`

### 2. 自定义空状态

\`\`\`tsx
<TaskCalendar
    tasks={tasks}
    renderEmptyState={(date) => (
        <button onClick={() => handleAddTask(date)}>
            添加任务到 {date.toLocaleDateString()}
        </button>
    )}
/>
\`\`\`

### 3. 完整示例（带状态管理）

\`\`\`tsx
import { useState } from 'react';
import { TaskCalendar, type CalendarTask } from '@/other_project/taskCalender';

function TaskManagementPage() {
    const [tasks, setTasks] = useState<CalendarTask[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        console.log('选中日期:', date);
    };

    const handleTaskClick = (task: CalendarTask, date: Date) => {
        console.log('点击任务:', task, '日期:', date);
        // 打开任务详情弹窗
    };

    const handleAddTask = (date: Date) => {
        console.log('添加任务到:', date);
        // 打开添加任务弹窗
    };

    return (
        <div className="page-container">
            <TaskCalendar
                tasks={tasks}
                defaultViewMode="month"
                showViewToggle={true}
                showTodayBadge={true}
                onDateSelect={handleDateSelect}
                onTaskClick={handleTaskClick}
                onEmptyDateClick={handleAddTask}
            />
        </div>
    );
}
\`\`\`

### 4. 使用预设颜色

\`\`\`tsx
import { TASK_COLORS } from '@/other_project/taskCalender';

const tasks: CalendarTask[] = [
    {
        id: 1,
        title: '学习任务',
        date: new Date(),
        type: 'learning',
        color: TASK_COLORS.learning,
    },
    {
        id: 2,
        title: '会议',
        date: new Date(),
        type: 'meeting',
        color: TASK_COLORS.meeting,
    },
];
\`\`\`

## 🎨 样式定制

### 外部样式覆盖

\`\`\`tsx
<TaskCalendar
    className="my-custom-calendar"
    tasks={tasks}
/>
\`\`\`

### 自定义颜色方案

\`\`\`tsx
const customTask: CalendarTask = {
    id: 1,
    title: '自定义任务',
    date: new Date(),
    color: 'bg-gradient-to-r from-pink-500 to-purple-500 border-pink-400',
};
\`\`\`

## 🔧 工具函数

组件还导出了一些有用的工具函数：

\`\`\`typescript
import {
    isSameDay,
    isToday,
    getWeekDays,
    getMonthDays,
    formatMonthTitle,
} from '@/other_project/taskCalender';

// 判断两个日期是否为同一天
if (isSameDay(date1, date2)) {
    console.log('同一天');
}

// 判断是否为今天
if (isToday(someDate)) {
    console.log('今天');
}

// 获取一周的日期
const weekDays = getWeekDays(new Date());

// 格式化月份标题
const title = formatMonthTitle(new Date()); // "2026年1月"
\`\`\`

## 📝 注意事项

1. **日期格式**：所有日期都使用 JavaScript 原生 `Date` 对象
2. **颜色类名**：颜色使用 Tailwind CSS 类名，确保项目已安装 Tailwind
3. **事件冒泡**：任务点击事件会阻止冒泡，不会触发日期点击
4. **性能优化**：使用 `useMemo` 优化日历网格计算

## 🐛 常见问题

### Q: 如何隐藏视图切换按钮？

\`\`\`tsx
<TaskCalendar showViewToggle={false} />
\`\`\`

### Q: 如何设置默认为周视图？

\`\`\`tsx
<TaskCalendar defaultViewMode="week" />
\`\`\`

### Q: 如何获取当前选中的日期？

使用受控组件模式：

\`\`\`tsx
const [selectedDate, setSelectedDate] = useState(new Date());

<TaskCalendar
    defaultSelectedDate={selectedDate}
    onDateSelect={setSelectedDate}
/>
\`\`\`

## 🔄 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0.0 | 2026-01-30 | 初始版本，重构为可复用组件 |

## 📚 相关文档

- [组件复用最佳实践](../../../my_notes/temp_notes/前端设计/组件复用/组件复用.md)
- [TodoItem 组件](../todoItem/README.md)
