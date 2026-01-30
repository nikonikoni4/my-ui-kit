/**
 * MilestoneAxis - 里程碑横轴展示组件
 * 用于展示里程碑进度，支持点击切换状态
 */

import React from 'react';
import { Flag, Check } from 'lucide-react';
import { MilestoneItem } from './types';

// ============================================================================
// MilestoneAxis - 里程碑横轴展示组件
// ============================================================================

export interface MilestoneAxisProps {
    milestones: MilestoneItem[];
    onToggle: (id: string, newState: number) => void;
    /** 自定义标签文本，默认为 "Milestones" */
    label?: string;
    /** 是否显示标签，默认为 true */
    showLabel?: boolean;
    /** 完成状态的颜色类名，默认为 "bg-green-500 border-green-600 text-white shadow-lg shadow-green-200" */
    completedClassName?: string;
    /** 未完成状态的颜色类名，默认为 "bg-white border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500" */
    pendingClassName?: string;
    /** 连接线完成颜色类名，默认为 "bg-green-400" */
    lineCompletedClassName?: string;
    /** 连接线未完成颜色类名，默认为 "bg-slate-200" */
    linePendingClassName?: string;
}

const MilestoneAxis: React.FC<MilestoneAxisProps> = ({
    milestones,
    onToggle,
    label = 'Milestones',
    showLabel = true,
    completedClassName = 'bg-green-500 border-green-600 text-white shadow-lg shadow-green-200',
    pendingClassName = 'bg-white border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500',
    lineCompletedClassName = 'bg-green-400',
    linePendingClassName = 'bg-slate-200'
}) => {
    if (milestones.length === 0) return null;

    // 按 orderIndex 排序显示
    const sortedMilestones = [...milestones].sort((a, b) => a.orderIndex - b.orderIndex);

    return (
        <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100">
            {showLabel && (
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Flag size={12} />
                    {label}
                </div>
            )}
            <div className="flex items-center w-full overflow-x-auto py-2">
                {sortedMilestones.map((milestone, index) => (
                    <React.Fragment key={milestone.id}>
                        {/* 连接线 */}
                        {index > 0 && (
                            <div className={`flex-1 min-w-[20px] h-0.5 transition-colors ${sortedMilestones[index - 1].state === 1 ? lineCompletedClassName : linePendingClassName
                                }`} />
                        )}

                        {/* 里程碑节点 */}
                        <div className="flex flex-col items-center flex-shrink-0 group">
                            <button
                                onClick={() => onToggle(milestone.id, milestone.state === 1 ? 0 : 1)}
                                className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${milestone.state === 1 ? completedClassName : pendingClassName
                                    }`}
                                title={milestone.content}
                            >
                                {milestone.state === 1 ? (
                                    <Check size={18} strokeWidth={3} />
                                ) : (
                                    <span className="text-xs font-bold">{index + 1}</span>
                                )}
                            </button>

                            {/* 内容 tooltip */}
                            <div className="mt-2 max-w-[100px] text-center">
                                <p className="text-[10px] text-slate-500 font-medium truncate" title={milestone.content}>
                                    {milestone.content || `Milestone ${index + 1}`}
                                </p>
                                {milestone.finishTime && (
                                    <p className="text-[9px] text-green-500 font-medium mt-0.5">
                                        {milestone.finishTime}
                                    </p>
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default MilestoneAxis;
