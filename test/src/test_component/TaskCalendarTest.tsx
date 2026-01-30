
import { useState } from 'react'
import { TaskCalendar } from '@my-ui-kit/core'
import type { CalendarTask } from '@my-ui-kit/core'

export function TaskCalendarTest() {
    // 生成模拟任务数据
    const generateMockTasks = (): CalendarTask[] => {
        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()

        return [
            {
                id: 1,
                title: 'React 深度研读',
                date: new Date(currentYear, currentMonth, 2),
                type: 'learning',
                color: 'bg-blue-400/30 border-blue-300/40'
            },
            {
                id: 2,
                title: '完成官方教程',
                date: new Date(currentYear, currentMonth, 2),
                type: 'learning',
                color: 'bg-blue-400/30 border-blue-300/40'
            },
            {
                id: 3,
                title: '项目周会',
                date: new Date(currentYear, currentMonth, 5),
                type: 'meeting',
                color: 'bg-purple-400/30 border-purple-300/40'
            },
            {
                id: 4,
                title: 'UI 设计评审',
                date: new Date(currentYear, currentMonth, 5),
                type: 'design',
                color: 'bg-pink-400/30 border-pink-300/40'
            },
            {
                id: 5,
                title: '阅读 CSAPP 第3章',
                date: new Date(currentYear, currentMonth, 12),
                type: 'reading',
                color: 'bg-emerald-400/30 border-emerald-300/40'
            },
            {
                id: 6,
                title: '系统架构重构',
                date: new Date(currentYear, currentMonth, 15),
                type: 'code',
                color: 'bg-orange-400/30 border-orange-300/40'
            },
            {
                id: 7,
                title: '发布 v2.0 版本',
                date: new Date(currentYear, currentMonth, 28),
                type: 'release',
                color: 'bg-red-400/30 border-red-300/40'
            },
            {
                id: 8,
                title: '编写测试用例',
                date: new Date(currentYear, currentMonth, 28),
                type: 'code',
                color: 'bg-orange-400/30 border-orange-300/40'
            },
            {
                id: 9,
                title: '整理任务池',
                date: new Date(currentYear, currentMonth, today.getDate()),
                type: 'misc',
                color: 'bg-white/20 border-white/20'
            },
        ]
    }

    const [tasks, setTasks] = useState<CalendarTask[]>(generateMockTasks())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)])
    }

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date)
        addLog(`选中日期: ${date.toLocaleDateString('zh-CN')}`)
    }

    const handleTaskClick = (task: CalendarTask, date: Date) => {
        addLog(`点击任务: "${task.title}" (${date.toLocaleDateString('zh-CN')})`)
    }

    const handleEmptyDateClick = (date: Date) => {
        const title = prompt('请输入新任务标题:')
        if (title) {
            const newTask: CalendarTask = {
                id: Date.now(),
                title,
                date,
                type: 'misc',
                color: 'bg-indigo-400/30 border-indigo-300/40'
            }
            setTasks(prev => [...prev, newTask])
            addLog(`添加任务: "${title}" 到 ${date.toLocaleDateString('zh-CN')}`)
        }
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
                    TaskCalendar 组件演示
                </h2>

                {/* 日历组件 */}
                <TaskCalendar
                    tasks={tasks}
                    defaultViewMode="month"
                    showViewToggle={true}
                    showTodayBadge={true}
                    onDateSelect={handleDateSelect}
                    onTaskClick={handleTaskClick}
                    onEmptyDateClick={handleEmptyDateClick}
                />

                {/* 信息面板 */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 选中日期信息 */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-xl">
                        <h3 className="text-xl font-semibold text-white mb-4">选中日期信息</h3>
                        {selectedDate ? (
                            <div className="space-y-2">
                                <p className="text-white/90">
                                    <span className="font-medium">日期:</span>{' '}
                                    {selectedDate.toLocaleDateString('zh-CN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'long'
                                    })}
                                </p>
                                <p className="text-white/90">
                                    <span className="font-medium">任务数:</span>{' '}
                                    {tasks.filter(t =>
                                        t.date.toDateString() === selectedDate.toDateString()
                                    ).length} 个
                                </p>
                            </div>
                        ) : (
                            <p className="text-white/60">请点击日历选择日期</p>
                        )}
                    </div>

                    {/* 操作日志 */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-xl">
                        <h3 className="text-xl font-semibold text-white mb-4">操作日志</h3>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                            {logs.length > 0 ? (
                                logs.map((log, index) => (
                                    <p key={index} className="text-sm text-white/80 font-mono">
                                        {log}
                                    </p>
                                ))
                            ) : (
                                <p className="text-white/60">暂无操作记录</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 使用说明 */}
                <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-xl">
                    <h3 className="text-xl font-semibold text-white mb-4">功能说明</h3>
                    <ul className="space-y-2 text-white/90">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>点击日期可以选中该日期，查看详细信息</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>点击任务卡片可以触发任务点击事件</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>悬停在空白日期上会显示"+ 添加"按钮，点击可添加新任务</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>使用左右箭头按钮切换月份/周</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>使用右上角的切换按钮在月视图和周视图之间切换</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
