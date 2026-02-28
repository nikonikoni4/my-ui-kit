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
        <div className="bg-white text-neutral-900 font-sans h-full w-full overflow-hidden flex flex-col p-6 lg:p-8 gap-6 rounded-[32px] shadow-sm border border-neutral-100">

            {/* 1. TOP OVERVIEW (Modular Cards Grid) */}
            <div className="w-full shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">

                {/* Left Stats - Visual Anchor */}
                <div className="flex flex-col justify-between bg-neutral-900 rounded-[24px] p-6 shadow-md border border-neutral-800 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between mb-4">
                        <h1 className="text-[12px] font-bold text-white/50 uppercase tracking-widest">Today Dashboard</h1>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                            <ArrowRight size={14} className="text-white -rotate-45" />
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-[54px] font-black tracking-tighter text-white leading-none">2</span>
                            <span className="text-[20px] font-bold text-white/40">/4</span>
                        </div>
                        <span className="text-emerald-400 font-extrabold text-[15px] px-3.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            50%
                        </span>
                    </div>
                    {/* A subtle progress bar at the bottom */}
                    <div className="relative z-10 w-full h-[4px] bg-white/10 rounded-full mt-5 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50%' }} />
                    </div>

                    {/* Decorative background element, optional */}
                    <div className="absolute top-[-50%] right-[-10%] w-[150px] h-[150px] bg-emerald-500/20 blur-[60px] rounded-full z-0 pointer-events-none" />
                </div>

                {/* Heatmap Area */}
                <div className="flex flex-col justify-between bg-[#F4F5F7] rounded-[24px] p-6 shadow-sm border border-neutral-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">12-Week Flow</h2>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm">
                            <ArrowRight size={14} className="text-neutral-400 -rotate-45" />
                        </div>
                    </div>
                    <div className="grid grid-flow-col grid-rows-5 gap-[5px] inline-grid self-start mt-auto">
                        {Array.from({ length: 12 * 5 }).map((_, i) => (
                            <div key={i} className={`w-[12px] h-[12px] rounded-[3px] border border-black/[0.03] ${Math.random() > 0.7 ? 'bg-emerald-500' :
                                Math.random() > 0.4 ? 'bg-emerald-300' :
                                    Math.random() > 0.2 ? 'bg-emerald-100' : 'bg-white'
                                }`} />
                        ))}
                    </div>
                </div>

                {/* Trend Area */}
                <div className="flex flex-col justify-between bg-[#F4F5F7] rounded-[24px] p-6 shadow-sm border border-neutral-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">4-Week Trend</h2>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer shadow-sm">
                            <ArrowRight size={14} className="text-neutral-400 -rotate-45" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-3 h-[80px] w-full mt-auto">
                        <div className="flex-1 bg-white hover:bg-neutral-200 transition-colors rounded-[8px] h-[50%]" />
                        <div className="flex-1 bg-white hover:bg-neutral-200 transition-colors rounded-[8px] h-[70%]" />
                        <div className="flex-1 bg-white hover:bg-neutral-200 transition-colors rounded-[8px] h-[40%]" />
                        <div className="flex-1 bg-emerald-500 rounded-[8px] h-[90%] shadow-lg shadow-emerald-500/30" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">

                {/* 2. LEFT SIDEBAR - Timeline (Flat, Light Grey Background) */}
                <div className="col-span-12 lg:col-span-3 bg-[#F4F5F7] rounded-[24px] p-6 h-full flex flex-col overflow-hidden">
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

                {/* 3. RIGHT CONTENT AREA - Cards & Chains */}
                <div className="col-span-12 lg:col-span-9 flex flex-col h-full overflow-hidden gap-6">

                    {/* Cards Container (No unnecessary outer wrapper, direct list) */}
                    <div className="flex-1 overflow-hidden flex flex-col no-scrollbar">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 mt-2 shrink-0">
                            <h2 className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                Active Habits <span className="bg-[#F4F5F7] text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{activeHabits.length}</span>
                            </h2>
                            <button className="text-xs font-bold text-neutral-400 flex items-center gap-1 hover:text-neutral-900 bg-[#F4F5F7] px-3 py-1.5 rounded-full transition-colors border border-neutral-100">
                                Filters
                            </button>
                        </div>

                        {/* Scrolling Card List (Strict Grid) */}
                        <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                            {/* Force exactly 2 columns on most screens to avoid irregular gaps */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                                {activeHabits.map(habit => (
                                    <div key={habit.id} className="min-w-[240px] bg-white rounded-[20px] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-neutral-200/60 flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-300 relative group h-[140px]">

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

                    {/* Established Chains (Integrated Modular Footer) */}
                    <div className="shrink-0 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                <ListTree size={14} className="text-emerald-500" /> Activity Chains
                            </h2>
                            <button className="text-[10px] font-bold text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-wider">
                                View All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockChains.map((chain, index) => {
                                const displayNodes = chain.nodes.slice(0, 4);
                                const hasMore = chain.nodes.length > 4;
                                // Alternate background style for variety, similar to the 4-week trend blocks
                                const isAlternate = index % 2 === 1;

                                return (
                                    <div key={chain.id} className={`rounded-[20px] p-5 border ${isAlternate ? 'bg-white border-neutral-200/60 shadow-sm' : 'bg-[#F4F5F7] border-neutral-100'} flex flex-col gap-3 transition-colors hover:border-neutral-300`}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-[14px] font-bold text-neutral-900 tracking-tight">{chain.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${isAlternate ? 'bg-neutral-100 text-neutral-500' : 'bg-white shadow-sm text-neutral-600'}`}>
                                                    {chain.nodes.length} steps
                                                </span>
                                                <button className="text-neutral-400 hover:text-emerald-500 transition-colors">
                                                    <Play size={14} className="fill-current" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 overflow-hidden w-full mt-1">
                                            {displayNodes.map((node, idx) => (
                                                <React.Fragment key={node.id}>
                                                    <div className={`px-2.5 py-1.5 rounded-[8px] border shrink-0 text-[10px] font-bold tracking-tight flex items-center gap-1.5 ${node.isHabit ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/20' : isAlternate ? 'bg-[#F4F5F7] border-transparent text-neutral-600' : 'bg-white border-neutral-200/50 text-neutral-600 shadow-sm'}`}>
                                                        {node.isHabit && <Check size={10} strokeWidth={4} />}
                                                        {node.name}
                                                    </div>
                                                    {idx < displayNodes.length - 1 && (
                                                        <ArrowRight size={10} className="text-neutral-300 shrink-0" />
                                                    )}
                                                </React.Fragment>
                                            ))}

                                            {hasMore && (
                                                <>
                                                    <ArrowRight size={10} className="text-neutral-300 shrink-0" />
                                                    <div className={`px-2 py-1.5 rounded-[8px] border border-dashed flex items-center justify-center shrink-0 cursor-pointer transition-colors ${isAlternate ? 'border-neutral-300 text-neutral-400 hover:bg-neutral-100' : 'bg-[#FAF9F7] border-neutral-300 text-neutral-400 hover:bg-white'}`}>
                                                        <span className="text-[10px] font-bold">+{chain.nodes.length - 4}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabitDashboardTest;
