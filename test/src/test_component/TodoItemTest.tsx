
import { useState } from 'react'
import { TodoItem } from '../../../ui-kit'

export function TodoItemTest() {
    const [todo, setTodo] = useState({
        id: 1,
        content: "测试任务内容",
        state: "pool",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">TodoItem 组件演示</h2>
            <TodoItem
                todo={todo as any}
                onUpdate={(_id, updates) => {
                    console.log('Update:', updates);
                    setTodo(prev => ({ ...prev, ...updates }));
                }}
                onDelete={(id) => console.log('Delete:', id)}
            />
        </div>
    )
}
