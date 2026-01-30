
import { useState } from 'react'
import { TodoItem } from '@my-ui-kit/core'
import './App.css'

function App() {
  const [todo, setTodo] = useState({
    id: 1,
    content: "测试任务内容",
    state: "pool",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">UI Kit 测试页面</h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">TodoItem 组件演示</h2>
        <TodoItem
          todo={todo as any}
          onUpdate={(id, updates) => {
            console.log('Update:', updates);
            setTodo(prev => ({ ...prev, ...updates }));
          }}
          onDelete={(id) => console.log('Delete:', id)}
        />
      </div>
    </div>
  )
}

export default App
