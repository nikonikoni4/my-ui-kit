import { useState } from 'react'
import { TodoItemTest } from './test_component/TodoItemTest'
import { TaskCalendarTest } from './test_component/TaskCalendarTest'
import { TodoItemTreeDetailedTest } from './test_component/TodoItemTreeDetailedTest'
import GlassCalendarTest from './test_component/GlassCalendarTest'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('todoItem')

  const renderContent = () => {
    switch (activeTab) {
      case 'todoItem':
        return <TodoItemTest />
      case 'todoItemTreeDetailed':
        return <TodoItemTreeDetailedTest />
      case 'dragDrop':
        return <div className="text-center p-8 text-gray-500">DragDrop 测试界面 (待添加)</div>
      case 'milestone':
        return <div className="text-center p-8 text-gray-500">Milestone 测试界面 (待添加)</div>
      case 'taskCalendar':
        return <TaskCalendarTest />
      case 'glassCalendar':
        return <GlassCalendarTest />
      default:
        return <div className="text-center p-8 text-gray-500">请选择一个组件进行测试</div>
    }
  }

  const tabs = [
    { id: 'todoItem', label: 'TodoItem' },
    { id: 'todoItemTreeDetailed', label: 'TodoItem Tree Detailed' },
    { id: 'dragDrop', label: 'DragDrop' },
    { id: 'milestone', label: 'Milestone' },
    { id: 'taskCalendar', label: 'TaskCalendar' },
    { id: 'glassCalendar', label: 'Glass Calendar' },
  ]

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">UI Kit 测试页面</h1>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-gray-50 rounded-xl p-6 min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  )
}

export default App
