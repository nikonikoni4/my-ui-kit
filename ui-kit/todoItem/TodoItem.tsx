import React, { useEffect, useRef, useState } from 'react';
import {
    Check,
    GripVertical,
    Trash2,
    Calendar,
    FileText,
    Clock,
    Pencil,
    Palette
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BaseTodoItem, TodoItemProps } from './types';

// State color mappings based on Aurora Design
const STATE_COLORS: Record<string, string> = {
    pool: 'bg-indigo-500',
    scheduled: 'bg-violet-500',
    completed: 'bg-emerald-500',
    shelved: 'bg-gray-400'
};

// State border colors for left accent
const STATE_BORDER_COLORS: Record<string, string> = {
    pool: '#6366f1',      // indigo-500
    scheduled: '#8b5cf6', // violet-500
    completed: '#10b981', // emerald-500
    shelved: '#9ca3af'    // gray-400
};

// Available todo background colors
const TODO_COLORS = [
    '#FFFFFF', // White
    '#E0F2FE', // Blue
    '#DCFCE7', // Green
    '#FEF3C7', // Amber
    '#FAE8FF', // Purple
    '#FEE2E2', // Red
    '#F3F4F6'  // Grey
];

// Get random color from TODO_COLORS
const getRandomColor = () => TODO_COLORS[Math.floor(Math.random() * TODO_COLORS.length)];

/**
 * TodoItem - 泛型任务项组件
 * 支持 render props 插槽用于自定义渲染
 */
export function TodoItem<T extends BaseTodoItem = BaseTodoItem>({
    item,
    isActive,
    onUpdate,
    onSelect,
    onDelete,
    renderTag,
    renderExtra,
    renderActions,
    showDate = true,
    showEditButton = false,
    dragType,
    dragSource,
    disableSortable = false,
    disableCardStyle = false,
    className,
}: TodoItemProps<T>) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showDetailEditor, setShowDetailEditor] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const detailEditorRef = useRef<HTMLDivElement>(null);

    // Type-safe access to optional properties
    const itemAny = item as any;
    const scheduledDate = itemAny.scheduledDate as string | null | undefined;
    const expectedFinishAt = itemAny.expectedFinishAt as string | null | undefined;
    const actualFinishAt = itemAny.actualFinishAt as string | null | undefined;
    const delayReason = itemAny.delayReason as string | null | undefined;
    const delayDays = itemAny.delayDays as number | null | undefined;

    // Detail editor form state
    const [editExpectedDate, setEditExpectedDate] = useState(expectedFinishAt || '');
    const [editActualDate, setEditActualDate] = useState(actualFinishAt || '');
    const [editDelayReason, setEditDelayReason] = useState(delayReason || '');

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        disabled: disableSortable,
        data: dragType || dragSource ? {
            type: dragType,
            source: dragSource,
            payload: item,
        } : undefined,
    });

    const borderColor = STATE_BORDER_COLORS[item.state] || STATE_BORDER_COLORS.pool;

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? undefined : transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative',
        backgroundColor: disableCardStyle ? 'transparent' : (item.color || '#FFFFFF'),
        ...(disableCardStyle ? {} : { borderLeft: `3px solid ${borderColor}` }),
    };

    // Auto-resize for textarea
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [item.content]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
            if (detailEditorRef.current && !detailEditorRef.current.contains(event.target as Node)) {
                setShowDetailEditor(false);
            }
        };
        if (showColorPicker || showDetailEditor) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showColorPicker, showDetailEditor]);

    // Sync form state when item changes
    useEffect(() => {
        setEditExpectedDate(expectedFinishAt || '');
        setEditActualDate(actualFinishAt || '');
        setEditDelayReason(delayReason || '');
    }, [expectedFinishAt, actualFinishAt, delayReason]);

    // Handle State Toggling (Checkbox)
    const toggleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onUpdate) return;

        if (item.state === 'completed') {
            const restoreState = scheduledDate ? 'scheduled' : 'pool';
            onUpdate(item.id, { state: restoreState } as Partial<T>);
        } else {
            onUpdate(item.id, {
                state: 'completed',
                actualFinishAt: new Date().toISOString().split('T')[0]
            } as unknown as Partial<T>);
        }
    };

    // Handle color selection
    const handleColorSelect = (color: string) => {
        onUpdate?.(item.id, { color } as Partial<T>);
        setShowColorPicker(false);
    };

    // Handle detail editor
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDetailEditor(!showDetailEditor);
    };

    const handleDetailSave = () => {
        onUpdate?.(item.id, {
            expectedFinishAt: editExpectedDate || null,
            actualFinishAt: editActualDate || null,
            delayReason: editDelayReason || null
        } as unknown as Partial<T>);
        setShowDetailEditor(false);
    };

    const isCompleted = item.state === 'completed';

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => onSelect?.(item.id)}
            className={`
                group relative flex items-start gap-3 py-3 pr-3 pl-10 transition-all duration-200 cursor-pointer
                ${disableCardStyle
                    ? 'mb-0'
                    : 'rounded-xl rounded-l-md mb-2 border border-slate-200/80'
                }
                ${disableCardStyle
                    ? ''
                    : isActive
                        ? 'ring-2 ring-blue-400 shadow-lg z-10'
                        : 'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)] hover:-translate-y-0.5'
                }
                ${isDragging ? 'shadow-xl' : ''}
                ${isCompleted ? 'opacity-60' : ''}
                ${className || ''}
            `}
        >
            {/* Drag Handle - Floating on left */}
            <div
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                className="absolute left-1 top-1 p-2 px-2.5 text-slate-300 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all z-20 flex items-center justify-center mt-0.5"
            >
                <GripVertical size={18} />
            </div>

            {/* Checkbox */}
            <button
                onClick={toggleComplete}
                className={`
                    w-5 h-5 rounded-lg border-[1.5px] flex items-center justify-center transition-all flex-shrink-0 mt-0.5
                    ${isCompleted
                        ? 'bg-slate-800 border-slate-800'
                        : 'border-slate-300 bg-white/50 hover:border-blue-400'
                    }
                `}
            >
                {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
            </button>

            {/* Content & Metadata */}
            <div className="flex-1 min-w-0">
                {/* 直接可编辑的内容 */}
                <textarea
                    ref={textareaRef}
                    value={item.content}
                    rows={1}
                    onChange={(e) => onUpdate?.(item.id, { content: e.target.value } as Partial<T>)}
                    onClick={(e) => e.stopPropagation()}
                    className={`
                        w-full bg-transparent border-none outline-none text-sm font-medium p-0 resize-none overflow-hidden
                        ${isCompleted ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}
                    `}
                    style={{ minHeight: '20px' }}
                    placeholder="Type a task..."
                />

                {/* Metadata Tags */}
                <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    {/* Render Props: Custom Tags */}
                    {renderTag?.(item)}



                    {/* Date Pill */}
                    {scheduledDate && showDate && (
                        <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${item.state === 'scheduled'
                            ? 'bg-violet-50 text-violet-600 border-violet-100'
                            : 'bg-slate-50 text-slate-500 border-slate-100'
                            }`}>
                            <Calendar size={10} />
                            <span>{scheduledDate}</span>
                        </div>
                    )}

                    {/* Delay Indicator */}
                    {delayDays && delayDays > 0 && (
                        <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-50 text-red-500 border border-red-100">
                            <Clock size={10} />
                            <span>+{delayDays}d</span>
                        </div>
                    )}

                    {/* Render Props: Extra Content */}
                    {renderExtra?.(item)}
                </div>
            </div>

            {/* Hover Actions: Edit, Color, Delete */}
            <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                {/* Render Props: Custom Actions */}
                {renderActions?.(item)}

                {/* Edit Button - 仅在每日聚焦等页面显示 */}
                {showEditButton && (
                    <div className="relative" ref={detailEditorRef}>
                        <button
                            onClick={handleEditClick}
                            className={`p-1.5 rounded-xl transition-all ${showDetailEditor ? 'text-blue-500 bg-blue-50' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-100'}`}
                            title="编辑详情"
                        >
                            <Pencil size={14} />
                        </button>

                        {/* Detail Editor Dropdown */}
                        {showDetailEditor && (
                            <div
                                className="absolute right-0 top-full mt-2 p-4 bg-white rounded-xl shadow-xl border border-slate-200 w-64"
                                style={{ zIndex: 9999 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">编辑任务详情</div>

                                    {/* 预计完成日期 */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">预计完成日期</label>
                                        <input
                                            type="date"
                                            value={editExpectedDate}
                                            onChange={(e) => setEditExpectedDate(e.target.value)}
                                            className="w-full px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* 实际完成日期 */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">实际完成日期</label>
                                        <input
                                            type="date"
                                            value={editActualDate}
                                            onChange={(e) => setEditActualDate(e.target.value)}
                                            className="w-full px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* 拖延/未完成原因 */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">拖延/未完成原因</label>
                                        <textarea
                                            value={editDelayReason}
                                            onChange={(e) => setEditDelayReason(e.target.value)}
                                            placeholder="记录原因..."
                                            rows={2}
                                            className="w-full px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none placeholder-slate-400"
                                        />
                                    </div>

                                    {/* 保存按钮 */}
                                    <button
                                        onClick={handleDetailSave}
                                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors"
                                    >
                                        确定
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Color Picker Button */}
                <div className="relative" ref={colorPickerRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowColorPicker(!showColorPicker);
                        }}
                        className={`p-1.5 rounded-xl transition-all ${showColorPicker ? 'text-purple-500 bg-purple-50' : 'text-slate-300 hover:text-purple-500 hover:bg-slate-100'}`}
                        title="选择颜色"
                    >
                        <Palette size={14} />
                    </button>

                    {/* Color Picker Dropdown */}
                    {showColorPicker && (
                        <div
                            className="absolute right-0 top-full mt-2 p-2.5 bg-white rounded-xl shadow-xl border border-slate-200 flex gap-1.5"
                            style={{ zIndex: 9999 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {TODO_COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleColorSelect(color)}
                                    className={`
                                        w-5 h-5 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110
                                        ${item.color === color ? 'ring-2 ring-slate-400 scale-110' : ''}
                                    `}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Delete Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(item.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="删除任务"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

// Export TODO_COLORS and getRandomColor for external use
export { TODO_COLORS, getRandomColor };
