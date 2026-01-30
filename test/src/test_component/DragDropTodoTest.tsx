
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CrossAreaDndProvider from '../../../ui-kit/dragDrop/context/CrossAreaDndContext';
import type { DragItemData, DropAreaData } from '../../../ui-kit/dragDrop/types';
import { TodoItem } from '../../../ui-kit/todoItem/TodoItem';
import type { TodoItem as TodoItemType } from '../../../ui-kit/todoItem/types';

// --- Mock Data ---
const MOCK_LEFT_ITEMS: TodoItemType[] = [
    {
        id: 101,
        content: 'Left Task 1',
        parentId: null,
        goalId: null,
        planDocId: null,
        sourceType: 'manual',
        sourceAnchorId: null,
        state: 'pool',
        scheduledDate: null,
        expectedFinishAt: null,
        actualFinishAt: null,
        delayDays: 0,
        delayReason: null,
        color: '#E0F2FE',
        orderIndex: 0,
        poolOrderIndex: 0,
    },
    {
        id: 102,
        content: 'Left Task 2',
        parentId: null,
        goalId: null,
        planDocId: null,
        sourceType: 'manual',
        sourceAnchorId: null,
        state: 'pool',
        scheduledDate: null,
        expectedFinishAt: null,
        actualFinishAt: null,
        delayDays: 0,
        delayReason: null,
        color: '#DCFCE7',
        orderIndex: 1,
        poolOrderIndex: 1,
    }
];

const MOCK_RIGHT_ITEMS: TodoItemType[] = [
    {
        id: 201,
        content: 'Right Task 1',
        parentId: null,
        goalId: null,
        planDocId: null,
        sourceType: 'manual',
        sourceAnchorId: null,
        state: 'scheduled',
        scheduledDate: '2023-10-27',
        expectedFinishAt: null,
        actualFinishAt: null,
        delayDays: 0,
        delayReason: null,
        color: '#FEF3C7',
        orderIndex: 0,
        poolOrderIndex: null,
    }
];

// --- Column Component ---
interface ColumnProps {
    id: string;
    title: string;
    items: TodoItemType[];
    onUpdate: (id: number, updates: Partial<TodoItemType>) => void;
    onDelete: (id: number) => void;
}

const SortableColumn = ({ id, title, items, onUpdate, onDelete }: ColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: id,
        data: {
            type: id, // 'left-area' or 'right-area'
            accepts: ['task'], // Accept items of type 'task'
        } as DropAreaData,
    });

    return (
        <div
            ref={setNodeRef}
            className="flex-1 min-h-[400px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col gap-2"
        >
            <h3 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider">{title}</h3>

            <SortableContext
                items={items.map(item => item.id)}
                strategy={verticalListSortingStrategy}
            >
                {items.length === 0 ? (
                    <div className="text-center text-slate-400 py-10 italic">Drop items here</div>
                ) : (
                    items.map(item => (
                        <TodoItem
                            key={item.id}
                            todo={item}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            dragType="task"       // Matches 'accepts' above
                            dragSource={id}       // 'left-area' or 'right-area'
                        />
                    ))
                )}
            </SortableContext>
        </div>
    );
};

// --- Main Test Component ---
export default function DragDropTodoTest() {
    const [leftItems, setLeftItems] = useState<TodoItemType[]>(MOCK_LEFT_ITEMS);
    const [rightItems, setRightItems] = useState<TodoItemType[]>(MOCK_RIGHT_ITEMS);

    const handleUpdate = (id: number, updates: Partial<TodoItemType>) => {
        // Simple update handler for demo
        setLeftItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        setRightItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const handleDelete = (id: number) => {
        setLeftItems(prev => prev.filter(item => item.id !== id));
        setRightItems(prev => prev.filter(item => item.id !== id));
    };

    // Keep strict track of which lists to update
    const findContainer = (id: number): 'left' | 'right' | undefined => {
        if (leftItems.find(item => item.id === id)) return 'left';
        if (rightItems.find(item => item.id === id)) return 'right';
        return undefined;
    };

    const handleCrossAreaDrop = (
        dragItem: DragItemData<TodoItemType>,
        dropArea: DropAreaData,
        event: any
    ) => {
        console.log('Cross Area Drop:', dragItem, '->', dropArea);
        const itemId = dragItem.id as number;
        const sourceContainer = findContainer(itemId);
        const targetContainerId = dropArea.id; // 'left-area' or 'right-area'

        // Avoid dropping on same container logic here if not needed
        // But the provider only calls onCrossAreaDrop if dragItem.source !== dropArea.type
        // TodoItem sets source to 'left-area' or 'right-area' in render

        if (!sourceContainer) return;
        if ((sourceContainer === 'left' && targetContainerId === 'left-area') ||
            (sourceContainer === 'right' && targetContainerId === 'right-area')) {
            return;
        }

        // Move Item
        let itemToMove: TodoItemType;
        if (sourceContainer === 'left') {
            itemToMove = leftItems.find(i => i.id === itemId)!;
            setLeftItems(prev => prev.filter(i => i.id !== itemId));
        } else {
            itemToMove = rightItems.find(i => i.id === itemId)!;
            setRightItems(prev => prev.filter(i => i.id !== itemId));
        }

        // Add to target
        if (targetContainerId === 'left-area') {
            setLeftItems(prev => [...prev, itemToMove]);
        } else {
            setRightItems(prev => [...prev, itemToMove]);
        }
    };

    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-2xl font-black text-slate-800 mb-8 border-b pb-4">
                Drag & Drop Test <span className="text-slate-400 font-normal text-base ml-2">TodoItem Cross Area</span>
            </h1>

            <CrossAreaDndProvider
                onCrossAreaDrop={handleCrossAreaDrop}
                renderDragOverlay={(dragItem) => {
                    const todo = dragItem.payload as TodoItemType;
                    return (
                        <div className="opacity-90 rotate-2 scale-105 pointer-events-none cursor-grabbing">
                            <TodoItem
                                todo={todo}
                                onUpdate={() => { }}
                                onDelete={() => { }}
                                isActive={true}
                            />
                        </div>
                    );
                }}
            >
                <div className="flex gap-8">
                    <SortableColumn
                        id="left-area"
                        title="Left Area (Pool)"
                        items={leftItems}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />

                    <SortableColumn
                        id="right-area"
                        title="Right Area (Scheduled)"
                        items={rightItems}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                </div>
            </CrossAreaDndProvider>

            <div className="mt-8 p-4 bg-slate-100 rounded-lg text-xs text-slate-500 font-mono">
                <p>Debug Info:</p>
                <p>Left Items: {leftItems.length}</p>
                <p>Right Items: {rightItems.length}</p>
            </div>
        </div>
    );
}
