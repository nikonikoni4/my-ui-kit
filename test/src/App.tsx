import { useState } from 'react'
import { TodoItemTest } from './test_component/TodoItemTest'
import { TaskCalendarTest } from './test_component/TaskCalendarTest'
import { TodoItemTreeDetailedTest } from './test_component/TodoItemTreeDetailedTest'
import GlassCalendarTest from './test_component/GlassCalendarTest'
import DragDropTodoTest from './test_component/DragDropTodoTest'
import DragDropTestPage from './test_component/DragDropTestPage'
import MarkdownEditorTest from './test_component/MarkdownEditorTest'
import HabitDashboardTest from './test_component/HabitDashboardTest'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('habitDashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'habitDashboard':
        return <HabitDashboardTest />
      case 'todoItem':
        return <TodoItemTest />
      case 'todoItemTreeDetailed':
        return <TodoItemTreeDetailedTest />
      case 'dragDrop':
        return <DragDropTodoTest />
      case 'integrated':
        return <DragDropTestPage />
      case 'milestone':
        return <div className="text-center p-8 text-gray-500">Milestone 测试界面 (待添加)</div>
      case 'taskCalendar':
        return <TaskCalendarTest />
      case 'glassCalendar':
        return <GlassCalendarTest />
      case 'markdownEditor':
        return <MarkdownEditorTest />
      default:
        return <div className="text-center p-8 text-gray-500">请选择一个组件进行测试</div>
    }
  }

  const tabs = [
    { id: 'habitDashboard', label: 'Habit Dashboard' },
    { id: 'markdownEditor', label: 'MarkdownEditor' },
    { id: 'todoItem', label: 'TodoItem' },
    { id: 'todoItemTreeDetailed', label: 'TodoItem Tree Detailed' },
    { id: 'dragDrop', label: 'DragDrop' },
    { id: 'integrated', label: 'Comp. Lab' },
    { id: 'milestone', label: 'Milestone' },
    { id: 'taskCalendar', label: 'TaskCalendar' },
    { id: 'glassCalendar', label: 'Glass Calendar' },
  ]

  if (activeTab === 'habitDashboard') {
    return (
      <div className="w-full h-screen overflow-hidden bg-[#FAF9F7] relative text-sm">
        <button
          onClick={() => setActiveTab('todoItem')}
          className="absolute bottom-8 right-8 z-50 bg-white backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-5 py-2.5 text-xs font-bold text-neutral-400 hover:text-neutral-800 border border-neutral-100 hover:-translate-y-0.5 transition-transform flex items-center gap-2"
        >
          Exit Dashboard
        </button>
        <HabitDashboardTest />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
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
