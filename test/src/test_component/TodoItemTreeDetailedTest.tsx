import React, { useState } from 'react';
import { type TodoItem } from '../../../ui-kit/todoItem/types';
import { TodoItemTreeDetailed } from '../../../ui-kit/todoItem';
const INITIAL_ITEMS: TodoItem[] = [
    {
        id: '1',
        content: "Root Task 1",
        parentId: null,
        goalId: null,
        planDocId: null,

        sourceAnchorId: null,
        state: 'scheduled',
        scheduledDate: '2023-10-27',
        expectedFinishAt: '2023-10-27',
        actualFinishAt: null,
        delayDays: null,
        delayReason: null,
        color: '#ffffff',
        orderIndex: 0,
        poolOrderIndex: 0,
        children: [
            {
                id: '11',
                content: "Child Task 1.1",
                parentId: '1',
                goalId: null,
                planDocId: null,

                sourceAnchorId: null,
                state: 'scheduled',
                scheduledDate: '2023-10-27',
                expectedFinishAt: null,
                actualFinishAt: null,
                delayDays: null,
                delayReason: null,
                color: '#ffffff',
                orderIndex: 0,
                poolOrderIndex: 0,
                children: []
            },
            {
                id: '12',
                content: "Child Task 1.2 (Completed)",
                parentId: '1',
                goalId: null,
                planDocId: null,

                sourceAnchorId: null,
                state: 'completed',
                scheduledDate: '2023-10-27',
                expectedFinishAt: '2023-10-27',
                actualFinishAt: '2023-10-27',
                delayDays: null,
                delayReason: null,
                color: '#e6fffa',
                orderIndex: 1,
                poolOrderIndex: 0,
                children: []
            }
        ]
    },
    {
        id: '2',
        content: "Root Task 2 (Delayed)",
        parentId: null,
        goalId: null,
        planDocId: null,

        sourceAnchorId: null,
        state: 'scheduled',
        scheduledDate: '2023-10-26',
        expectedFinishAt: '2023-10-26',
        actualFinishAt: null,
        delayDays: 1,
        delayReason: "Unexpected blockers",
        color: '#fff5f5',
        orderIndex: 1,
        poolOrderIndex: 1,
        children: []
    }
];

export const TodoItemTreeDetailedTest: React.FC = () => {
    const [items, setItems] = useState(INITIAL_ITEMS);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleUpdate = (id: string, updates: Partial<TodoItem>) => {
        console.log(`Update item ${id}:`, updates);

        // Helper to update recursively
        const updateRecursive = (list: TodoItem[]): TodoItem[] => {
            return list.map(item => {
                if (item.id === id) {
                    return { ...item, ...updates };
                }
                if (item.children) {
                    return { ...item, children: updateRecursive(item.children) };
                }
                return item;
            });
        };

        setItems(prev => updateRecursive(prev));
    };

    const handleDelete = (id: string) => {
        console.log(`Delete item ${id}`);

        // Helper to delete recursively
        const deleteRecursive = (list: TodoItem[]): TodoItem[] => {
            return list.filter(item => item.id !== id).map(item => ({
                ...item,
                children: item.children ? deleteRecursive(item.children) : []
            }));
        };

        setItems(prev => deleteRecursive(prev));
    };

    const handleSelect = (id: string) => {
        console.log(`Select item ${id}`);
        setSelectedId(id);
    };

    const handleExpandChange = (id: string, expanded: boolean) => {
        console.log(`Expand change item ${id}: ${expanded}`);
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">TodoItemTreeDetailed Test</h2>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <TodoItemTreeDetailed
                    items={items}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onSelect={handleSelect}
                    selectedId={selectedId}
                    onExpandChange={handleExpandChange}
                    collapsible={true}
                    showDate={true}

                />
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded text-sm text-gray-600">
                <h3 className="font-semibold mb-2">Debug Info:</h3>
                <pre>{JSON.stringify(items, null, 2)}</pre>
            </div>
        </div>
    );
};
