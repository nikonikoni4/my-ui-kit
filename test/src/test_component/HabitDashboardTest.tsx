import React from 'react';
import { Play, Check, Flame, Anchor, ListTree, MoreHorizontal, ArrowRight, MoreVertical } from 'lucide-react';

// --- Types & Mock Data ---

type HabitStatus = 'active' | 'paused';
type CheckInStatus = 'pending' | 'done';

interface Habit {
    id: string;
    name: string;
    frequency: string;
    streak: number;
    level: { value: number; name: string };
    progress: { current: number; total: number };
    tags: { anchor?: string; value?: string; commitment?: string };
    status: HabitStatus;
    todayStatus: CheckInStatus;
}

const mockHabits: Habit[] = [
    {
        id: 'h1', name: '晨间冥想', frequency: '每天', streak: 23,
        level: { value: 2, name: '枝繁' }, progress: { current: 12, total: 18 },
        tags: { anchor: '07:05 晨间流程', value: '内心平和' },
        status: 'active', todayStatus: 'done'
    },
    {
        id: 'h2', name: '阅读专业书籍', frequency: '工作日', streak: 5,
        level: { value: 1, name: '生根' }, progress: { current: 3, total: 15 },
        tags: { value: '持续成长', commitment: '每日精进' },
        status: 'active', todayStatus: 'pending'
    },
    {
        id: 'h3', name: '核心力量训练', frequency: '周一、三、五', streak: 0,
        level: { value: 0, name: '萌芽' }, progress: { current: 1, total: 5 },
        tags: { anchor: '下班后' },
        status: 'active', todayStatus: 'pending'
    },
    {
        id: 'h4', name: '睡前断网', frequency: '每天', streak: 12,
        level: { value: 3, name: '稳固' }, progress: { current: 20, total: 21 },
        tags: { anchor: '22:30 晚间流程' },
        status: 'active', todayStatus: 'done'
    },
    {
        id: 'h5', name: '学习西班牙语', frequency: '周末', streak: 0,
        level: { value: 0, name: '萌芽' }, progress: { current: 0, total: 4 },
        tags: {},
        status: 'paused', todayStatus: 'pending'
    }
];

interface ChainData {
    id: string;
    name: string;
    nodes: { id: string; name: string; isHabit: boolean }[];
}

const mockChains: ChainData[] = [
    {
        id: 'c1',
        name: '晨间流程',
        nodes: [
            { id: 'n1', name: '起床喝水', isHabit: false },
            { id: 'n2', name: '晨间冥想', isHabit: true },
            { id: 'n3', name: '吃早饭', isHabit: false },
            { id: 'n8', name: '换衣服', isHabit: false },
            { id: 'n9', name: '出门', isHabit: false }
        ]
    },
    {
        id: 'c2',
        name: '晚间流程',
        nodes: [
            { id: 'n4', name: '洗漱', isHabit: false },
            { id: 'n5', name: '睡前断网', isHabit: true }
        ]
    }
];

const HOUR_HEIGHT = 60; // 60px per hour

const timelineEvents = [
    { id: '1', title: '睡眠', startTime: '00:00', endTime: '07:00', isHabit: false },
    { id: '2', title: '起床喝水', startTime: '07:00', endTime: '07:10', isHabit: false },
    { id: '3', title: '晨间冥想', startTime: '07:15', endTime: '07:45', isHabit: true },
    { id: '4', title: '吃早饭', startTime: '07:45', endTime: '08:15', isHabit: false },
    { id: '5', title: '出门通勤', startTime: '08:30', endTime: '09:00', isHabit: false },
    { id: '6', title: '核心力量训练', startTime: '18:30', endTime: '19:15', isHabit: true },
    { id: '7', title: '写需求文档', startTime: '20:00', endTime: '21:30', isHabit: true },
    { id: '8', title: '晚间洗漱', startTime: '22:00', endTime: '22:30', isHabit: false },
    { id: '9', title: '睡前断网', startTime: '22:30', endTime: '23:00', isHabit: true },
];

const timeToHour = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
};

export const HabitDashboardTest: React.FC = () => {
    const activeHabits = mockHabits.filter(h => h.status === 'active');
    const pausedHabits = mockHabits.filter(h => h.status === 'paused');

    const timelineRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (timelineRef.current) {
            const now = new Date();
            const currentHour = now.getHours() + now.getMinutes() / 60;
            // scroll to (currentHour - 1) so we have a bit of context visually
            timelineRef.current.scrollTop = Math.max(0, (currentHour - 1) * HOUR_HEIGHT);
        }
    }, []);

    return (
        <div className="bg-slate-50 text-neutral-900 font-sans h-full w-full overflow-hidden flex flex-col p-4 lg:p-6 gap-3 rounded-[32px] shadow-sm border border-neutral-100">

            {/* 1. GLOBAL HEADER */}
            <div className="w-full shrink-0 flex items-center justify-between px-2 mb-1 mt-1">
                <div>
                    <h1 className="text-[28px] font-black text-neutral-900 tracking-tight leading-none mb-1">Morning, Nico</h1>
                    <p className="text-[13px] font-bold text-neutral-400">Oct 24, 星期四</p>
                </div>
                <button className="flex items-center gap-1.5 bg-neutral-900 text-white px-5 py-2.5 rounded-[14px] text-[13px] font-bold shadow-md shadow-neutral-900/20 hover:bg-neutral-800 hover:-translate-y-0.5 transition-all active:scale-95">
                    <span className="text-lg leading-none mb-[2px]">+</span> 新建习惯
                </button>
            </div>

            {/* 2. TOP OVERVIEW (Bento Box Layout) */}
            <div className="w-full shrink-0 flex flex-col lg:flex-row gap-3 pb-0">

                {/* Left Tall Card - Daily Tips */}
                <div className="w-full lg:w-3/12 bg-[#F0FDF4] rounded-[24px] p-6 shadow-sm border border-emerald-100 flex flex-col relative overflow-hidden min-h-[160px]">
                    <div className="relative z-10 flex flex-col h-full">
                        <h2 className="text-[11px] font-bold text-emerald-600/70 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                            <Flame size={14} className="text-emerald-500" /> Daily Insight
                        </h2>
                        <div className="mb-2">
                            <p className="text-[15px] font-bold text-emerald-950 leading-relaxed mb-3">
                                当你不想做时，<br />执行“最小版本”。
                            </p>
                            <p className="text-[12px] font-medium text-emerald-800/80 leading-[1.7]">
                                即使抗拒，也承诺只做“迷你版”：说好跑3公里，那就只换鞋出门走一圈。99%的情况，只要开始了，就会多做一点。系统记录你的开始，这本身就是胜利。
                            </p>
                        </div>
                    </div>
                    {/* Decorative Element */}
                    <div className="absolute right-[-10px] bottom-[-30px] text-emerald-500/10 font-serif text-[140px] leading-none pointer-events-none tracking-tighter select-none">
                        "
                    </div>
                </div>

                {/* Right Area - Stacked Panels */}
                <div className="w-full lg:w-9/12 flex flex-col gap-3">

                    {/* Top Row: Today Dashboard (Wide) */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                        {/* Title & Stats */}
                        <div className="flex flex-col relative z-10 w-full sm:w-auto">
                            <h2 className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Today Dashboard</h2>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-[44px] font-black tracking-tighter text-neutral-900 leading-none">2</span>
                                <span className="text-[18px] font-bold text-neutral-300">/4</span>
                            </div>
                        </div>

                        {/* Progress Layout */}
                        <div className="flex-1 w-full max-w-lg relative z-10 mt-4 sm:mt-0">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[13px] font-bold text-neutral-600">今日进度</span>
                                <span className="text-emerald-600 font-extrabold text-[14px] px-3.5 py-1 bg-[#F0FDF4] rounded-full border border-emerald-100 shadow-sm">
                                    50%
                                </span>
                            </div>
                            <div className="h-[8px] w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50%' }} />
                            </div>
                        </div>

                        {/* Detail Arrow */}
                        <div className="hidden sm:flex w-10 h-10 shrink-0 rounded-full bg-white items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer border border-neutral-100 shadow-sm relative z-10 ml-4">
                            <ArrowRight size={16} className="text-neutral-400 -rotate-45" />
                        </div>
                    </div>

                    {/* Bottom Row: Charts (Split) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-h-[140px]">

                        {/* Heatmap Area */}
                        <div className="flex flex-col justify-between bg-white rounded-[24px] p-5 shadow-sm border border-neutral-100 relative">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">12-Week Flow</h2>
                                <div className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer">
                                    <ArrowRight size={14} className="text-neutral-400 -rotate-45" />
                                </div>
                            </div>
                            <div className="grid grid-flow-col grid-rows-5 gap-[4px] inline-grid self-start md:mx-auto">
                                {Array.from({ length: 12 * 5 }).map((_, i) => (
                                    <div key={i} className={`w-[11px] h-[11px] rounded-[3px] border border-black/[0.03] ${Math.random() > 0.7 ? 'bg-emerald-500' : Math.random() > 0.4 ? 'bg-emerald-300' : Math.random() > 0.2 ? 'bg-emerald-100' : 'bg-slate-50'}`} />
                                ))}
                            </div>
                        </div>

                        {/* Trend Area */}
                        <div className="flex flex-col justify-between bg-white rounded-[24px] p-5 shadow-sm border border-neutral-100 relative">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">4-Week Trend</h2>
                                <div className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer">
                                    <ArrowRight size={14} className="text-neutral-400 -rotate-45" />
                                </div>
                            </div>
                            <div className="flex items-end justify-between gap-3 h-[60px] w-full mt-auto px-2">
                                <div className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors rounded-[6px] h-[50%]" />
                                <div className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors rounded-[6px] h-[70%]" />
                                <div className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors rounded-[6px] h-[40%]" />
                                <div className="flex-1 bg-emerald-500 rounded-[6px] h-[90%] shadow-lg shadow-emerald-500/30" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">

                {/* 2. LEFT SIDEBAR - Timeline (Flat, Light Grey Background) */}
                <div className="col-span-12 lg:col-span-3 bg-white rounded-[24px] p-6 h-full flex flex-col overflow-hidden shadow-sm border border-neutral-100">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            Timeline
                        </h2>
                        <button className="text-neutral-400 hover:text-neutral-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse"></span>
                        </button>
                    </div>

                    <div
                        ref={timelineRef}
                        className="flex-1 overflow-y-auto no-scrollbar relative w-full scroll-smooth"
                    >
                        <div className="relative w-full" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
                            {/* Vertical Line */}
                            <div className="absolute left-[45px] top-0 bottom-0 w-[2px] bg-neutral-200/80 z-0" />

                            {/* Background Hour Indicators */}
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="absolute left-0 right-0 border-t border-neutral-200/50 z-0" style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}>
                                    <div className="absolute top-[-8px] left-0 w-8 text-right text-[10px] font-bold text-neutral-300 font-mono">
                                        {String(i).padStart(2, '0')}:00
                                    </div>
                                </div>
                            ))}

                            {/* Current Time Indicator Line */}
                            <div
                                className="absolute left-[45px] right-0 flex items-center z-20 pointer-events-none"
                                style={{ top: (new Date().getHours() + new Date().getMinutes() / 60) * HOUR_HEIGHT }}
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 -ml-[3px]" />
                                <div className="flex-1 h-[2px] bg-red-500/50" />
                            </div>

                            {/* Events */}
                            {timelineEvents.map(event => {
                                const startHour = timeToHour(event.startTime);
                                const endHour = timeToHour(event.endTime);
                                const top = startHour * HOUR_HEIGHT;
                                const height = Math.max((endHour - startHour) * HOUR_HEIGHT, 24);

                                return (
                                    <div key={event.id} className="absolute left-0 right-0 group z-10" style={{ top, height }}>
                                        {/* Event Specific Time */}
                                        <div className="absolute top-0 left-0 w-8 text-right text-[9px] font-bold text-emerald-600 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {event.startTime}
                                        </div>

                                        {/* Node Dot */}
                                        <div className={`absolute top-1.5 left-[46px] w-2 h-2 rounded-full -translate-x-1/2 ${event.isHabit ? 'bg-emerald-500 ring-2 ring-[#F4F5F7]' : 'bg-neutral-400'}`} />

                                        {/* Content Block */}
                                        <div className={`absolute left-[56px] right-2 top-0 bottom-0 ${event.isHabit ? 'bg-emerald-500/10 border-l-[3px] border-emerald-500 rounded-r-xl px-3 py-1.5 flex flex-col justify-center overflow-hidden transition-all hover:bg-emerald-500/20 shadow-sm' : 'px-2 py-1 flex items-start'}`}>
                                            <div className="flex items-center justify-between w-full">
                                                <p className={`text-[11px] font-bold tracking-tight truncate ${event.isHabit ? 'text-emerald-900' : 'text-neutral-600'}`}>
                                                    {event.title}
                                                </p>
                                                {event.isHabit && <Check size={12} className="text-emerald-500 flex-shrink-0" />}
                                            </div>
                                            {event.isHabit && height >= 40 && (
                                                <p className="text-[9px] text-emerald-700/60 font-medium mt-0.5">{event.startTime} - {event.endTime}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 3. MIDDLE COLUMN - Activity Chains */}
                <div className="col-span-12 lg:col-span-3 bg-white rounded-[24px] p-6 h-full flex flex-col overflow-hidden shadow-sm border border-neutral-100">
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <h2 className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                            <ListTree size={14} className="text-emerald-500" /> 习惯链
                        </h2>
                        <button className="text-[10px] font-bold text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-wider">
                            All
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 pr-2">
                        {mockChains.map((chain, index) => {
                            const isAlternate = index % 2 === 1;
                            const displayNodes = chain.nodes.slice(0, 2);
                            const hasMore = chain.nodes.length > 2;

                            return (
                                <div key={chain.id} className="rounded-[20px] p-4 border border-neutral-100 bg-slate-50 flex flex-col gap-3 transition-colors hover:border-neutral-200 shrink-0">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[14px] font-bold text-neutral-900 tracking-tight leading-tight truncate pr-2 max-w-[120px]">{chain.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide bg-white border border-neutral-100 text-neutral-500 shadow-sm">
                                                {chain.nodes.length} steps
                                            </span>
                                            <button className="text-neutral-400 hover:text-emerald-500 transition-colors">
                                                <Play size={14} className="fill-current" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full mt-1.5 relative">
                                        {displayNodes.map((node, idx) => (
                                            <div key={node.id} className={`relative z-10 px-3 py-2 rounded-[12px] border flex items-center justify-between w-full ${node.isHabit ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/20' : 'bg-white border-neutral-100 text-neutral-600 shadow-sm'}`}>
                                                {/* Left: Node dot / icon indicator */}
                                                <div className="flex items-center justify-start w-5 h-5 shrink-0">
                                                    {node.isHabit ? (
                                                        <Check size={12} strokeWidth={4} className="text-white" />
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300"></div>
                                                    )}
                                                </div>

                                                {/* Center: Text */}
                                                <span className="text-[11px] font-bold tracking-tight truncate flex-1 text-center">{node.name}</span>

                                                {/* Right: Dummy spacer to ensure absolute centering */}
                                                <div className="w-5 h-5 shrink-0"></div>
                                            </div>
                                        ))}

                                        {hasMore && (
                                            <div className="relative z-10 px-3 py-2 rounded-[12px] border border-dashed border-neutral-300 bg-white/50 text-neutral-400 hover:bg-white flex items-center justify-between w-full cursor-pointer transition-colors">
                                                {/* Left: Dot */}
                                                <div className="flex items-center justify-start w-5 h-5 shrink-0">
                                                    <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
                                                </div>

                                                {/* Center: Text */}
                                                <span className="text-[10px] font-bold text-center flex-1">+{chain.nodes.length - 2} pending steps</span>

                                                {/* Right: Spacer */}
                                                <div className="w-5 h-5 shrink-0"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. RIGHT CONTENT AREA - Active Habits */}
                <div className="col-span-12 lg:col-span-6 bg-white rounded-[24px] p-6 h-full flex flex-col overflow-hidden shadow-sm border border-neutral-100">
                    <div className="flex items-center justify-between mb-6 shrink-0 pr-2">
                        <h2 className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                            Active Habits <span className="bg-[#F4F5F7] text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{activeHabits.length}</span>
                        </h2>
                        <button className="text-xs font-bold text-neutral-400 flex items-center gap-1 hover:text-neutral-900 bg-[#F4F5F7] px-3 py-1.5 rounded-full transition-colors border border-neutral-100">
                            Filters
                        </button>
                    </div>

                    {/* Scrolling Card List (Strict Grid) */}
                    <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-4">
                            {activeHabits.map(habit => (
                                <div key={habit.id} className="min-w-[220px] bg-slate-50 rounded-[20px] p-4 border border-neutral-100 flex flex-col justify-between transition-transform hover:-translate-y-0.5 hover:bg-slate-100 duration-300 relative group h-[140px]">

                                    <div>
                                        {/* Top Header of Card */}
                                        <div className="flex justify-between items-start mb-2.5">
                                            <h3 className="text-[15px] font-bold text-neutral-900 tracking-tight leading-tight truncate pr-2">{habit.name}</h3>
                                            <div className="flex flex-col items-end flex-shrink-0">
                                                <span className="text-[10px] font-black text-neutral-800">Lv.{habit.level.value}</span>
                                            </div>
                                        </div>

                                        {/* Pill Tags inline */}
                                        <div className="flex items-center flex-wrap gap-1.5 mb-1 h-[22px] overflow-hidden">
                                            <span className="bg-[#F4F5F7] px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide text-neutral-500 uppercase">{habit.frequency}</span>
                                            {habit.streak > 0 && (
                                                <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md tracking-wide">
                                                    <Flame size={10} className="fill-amber-500" strokeWidth={2} /> {habit.streak}
                                                </span>
                                            )}
                                            {habit.tags.anchor && (
                                                <span className="flex items-center gap-1 text-blue-600 bg-blue-50/60 px-2.5 py-0.5 rounded-md text-[9px] font-bold">
                                                    <Anchor size={10} strokeWidth={2.5} /> {habit.tags.anchor}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Actions of Card */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex-1 mr-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-bold text-neutral-400 tracking-wider">PROGRESS</span>
                                                <span className="text-[9px] font-bold text-neutral-500 tracking-wider">{habit.progress.current}/{habit.progress.total}</span>
                                            </div>
                                            <div className="h-[4px] w-full bg-[#F4F5F7] rounded-full overflow-hidden">
                                                <div className="h-full bg-neutral-900 rounded-full transition-all duration-500" style={{ width: `${(habit.progress.current / habit.progress.total) * 100}%` }} />
                                            </div>
                                        </div>
                                        {habit.todayStatus === 'done' ? (
                                            <button className="flex items-center justify-center bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-md text-[10px] font-bold transition-colors hover:bg-emerald-100 border border-emerald-100/50">
                                                <Check size={12} strokeWidth={3} className="mr-1" /> DONE
                                            </button>
                                        ) : (
                                            <button className="flex items-center justify-center bg-neutral-900 text-white px-4 py-1.5 rounded-md text-[10px] font-bold transition-all hover:bg-neutral-800 hover:scale-105 active:scale-95 shadow-md shadow-neutral-900/20">
                                                CHECK IN
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {pausedHabits.map(habit => (
                                <div key={habit.id} className="bg-[#F4F5F7]/50 border border-dashed border-neutral-300 rounded-[20px] p-4 flex flex-col justify-center h-[140px] group cursor-pointer hover:bg-[#F4F5F7] hover:border-neutral-400 transition-colors">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-[14px] font-bold text-neutral-400 line-through decoration-neutral-300">{habit.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-white text-neutral-400 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide uppercase border border-neutral-200">Paused</span>
                                        <button className="text-[10px] font-bold text-neutral-400 ml-auto flex items-center gap-1 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={10} className="fill-current mr-1" /> Resume
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabitDashboardTest;
