# 跨区域拖拽组件库 (dragDrop)

基于 `@dnd-kit` 封装的通用跨区域拖拽解决方案，可独立迁移到任何 React 项目。

## 📦 目录结构

```
dragDrop/
├── index.ts                      # 统一导出
├── types.ts                      # 类型定义
├── context/
│   └── CrossAreaDndContext.tsx   # 跨区域拖拽上下文
├── components/
│   ├── DraggableItem.tsx         # 可拖拽项组件
│   └── DroppableArea.tsx         # 可放置区域组件
├── hooks/
│   └── useCrossAreaDnd.ts        # 拖拽状态管理 Hook
└── examples/
    └── TaskPoolCalendarExample.tsx  # 使用示例
```

## 🚀 快速开始

### 安装依赖

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 方式一：使用 Provider 组件（推荐）

```tsx
import {
  CrossAreaDndProvider,
  DraggableItem,
  DroppableDateCell,
  DroppablePoolRoot,
} from '@/other_project/dragDrop';

function App() {
  const handleCrossAreaDrop = (dragItem, dropArea) => {
    if (dropArea.type === 'date-cell') {
      // 处理拖拽到日期格子
      scheduleTask(dragItem.payload, dropArea.payload.date);
    } else if (dropArea.type === 'pool-root') {
      // 处理拖拽回任务池
      unscheduleTask(dragItem.payload);
    }
  };

  return (
    <CrossAreaDndProvider
      onCrossAreaDrop={handleCrossAreaDrop}
      renderDragOverlay={(item) => <TaskPreview task={item.payload} />}
    >
      {/* 任务池 */}
      <DroppablePoolRoot>
        {tasks.map(task => (
          <DraggableItem
            key={task.id}
            id={task.id}
            type="task"
            source="task-pool"
            data={task}
          >
            <TaskCard task={task} />
          </DraggableItem>
        ))}
      </DroppablePoolRoot>

      {/* 日历 */}
      {dates.map(date => (
        <DroppableDateCell key={date} date={date}>
          <DateContent date={date} />
        </DroppableDateCell>
      ))}
    </CrossAreaDndProvider>
  );
}
```

### 方式二：使用 Hook（更灵活）

```tsx
import { useCrossAreaDnd } from '@/other_project/dragDrop';
import { DndContext, DragOverlay } from '@dnd-kit/core';

function App() {
  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    activeItem,
  } = useCrossAreaDnd({
    onCrossAreaDrop: (dragItem, dropArea) => {
      // 处理跨区域拖拽
    },
  });

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* 你的内容 */}
      
      <DragOverlay>
        {activeItem && <TaskPreview task={activeItem.payload} />}
      </DragOverlay>
    </DndContext>
  );
}
```

## 📚 API 文档

### `CrossAreaDndProvider`

跨区域拖拽上下文提供者。

| Prop | Type | Description |
|------|------|-------------|
| `onCrossAreaDrop` | `(dragItem, dropArea, event) => void` | 跨区域拖拽完成回调 |
| `onDragStart` | `(event) => void` | 拖拽开始回调 |
| `onDragEnd` | `(event) => void` | 拖拽结束回调 |
| `renderDragOverlay` | `(dragItem) => ReactNode` | 拖拽预览渲染函数 |
| `enableKeyboard` | `boolean` | 是否启用键盘控制（默认 `true`） |
| `activationDistance` | `number` | 激活拖拽的距离（默认 `8`） |

### `DraggableItem`

可拖拽项包装组件。

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string \| number` | 唯一标识 |
| `type` | `string` | 拖拽项类型（默认 `'item'`） |
| `source` | `DragSourceType` | 来源区域 |
| `data` | `T` | 携带的数据 |
| `disabled` | `boolean` | 是否禁用拖拽 |
| `draggingClassName` | `string` | 拖拽时的额外类名 |

### `DroppableArea`

通用可放置区域组件。

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string \| number` | 唯一标识 |
| `type` | `DropTargetType` | 放置区域类型 |
| `data` | `T` | 携带的数据 |
| `accepts` | `string[]` | 接受的拖拽项类型 |
| `hoverClassName` | `string` | 悬停时的额外类名 |
| `hoverHint` | `string` | 悬停时显示的提示 |

### 预设放置区域组件

- `DroppableDateCell` - 日历日期格子
- `DroppableFolder` - 文件夹
- `DroppablePoolRoot` - 任务池根目录
- `DroppableTrash` - 删除区

### `useCrossAreaDnd` Hook

拖拽状态管理 Hook。

```tsx
const {
  dragState,           // 当前拖拽状态
  handleDragStart,     // DndContext 的 onDragStart
  handleDragOver,      // DndContext 的 onDragOver
  handleDragEnd,       // DndContext 的 onDragEnd
  isDragging,          // 是否正在拖拽
  activeItem,          // 当前拖拽的项
  overArea,            // 当前悬停的放置区域
  resetDragState,      // 重置状态
} = useCrossAreaDnd(options);
```

## 🎯 典型场景

### 任务池 → 日历

```tsx
<DroppablePoolRoot>
  {poolTasks.map(task => (
    <DraggableItem 
      id={task.id} 
      type="task" 
      source="task-pool" 
      data={task}
    >
      <TaskCard task={task} />
    </DraggableItem>
  ))}
</DroppablePoolRoot>

{dates.map(date => (
  <DroppableDateCell date={date}>
    {/* 日期内已安排的任务 */}
  </DroppableDateCell>
))}
```

### 文件夹分组

```tsx
{folders.map(folder => (
  <DroppableFolder folderId={folder.id} folderName={folder.name}>
    {folder.tasks.map(task => (
      <DraggableItem id={task.id} source="folder" data={task}>
        <TaskCard task={task} />
      </DraggableItem>
    ))}
  </DroppableFolder>
))}
```

## 🔄 与 todoItem 组件库配合

```tsx
import { TodoItem, TodoItemTree } from '@/other_project/todoItem';
import { 
  CrossAreaDndProvider, 
  DraggableItem 
} from '@/other_project/dragDrop';

// 包装 TodoItem
<DraggableItem id={task.id} type="task" source="pool" data={task}>
  <TodoItem todo={task} onUpdate={...} onDelete={...} />
</DraggableItem>
```

## 📋 迁移清单

将此组件库迁移到新项目时：

1. ✅ 复制整个 `dragDrop` 目录
2. ✅ 安装依赖：`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
3. ✅ 更新导入路径
4. ✅ 根据需要自定义样式类名

---

## ⚠️ 常见问题与故障排查

### 问题 1：`Cannot read properties of undefined (reading 'content')`

**错误场景：**
```tsx
// ❌ 错误：使用了 payload 而不是 data
<DraggableItem
  id={task.id}
  type="task"
  source="task-pool"
  payload={task}  // ❌ 错误的 prop 名称
>
  <TaskCard task={task} />
</DraggableItem>

// 在 renderDragOverlay 中访问
renderDragOverlay={(dragItem) => (
  <div>{dragItem.payload.content}</div>  // ❌ payload 是 undefined
)}
```

**根本原因：**

`DraggableItem` 组件的 props 定义中，数据属性名称是 `data`，而不是 `payload`。虽然组件内部会将 `data` 转换为 `payload` 存储到拖拽数据中，但如果传入的 prop 名称错误，`data` 就会是 `undefined`，导致 `payload` 也是 `undefined`。

**数据流：**
```
DraggableItem props.data (你传入的数据)
    ↓
useSortable({ data: { payload: data } })  (内部转换)
    ↓
dragItem.payload (在回调中访问)
```

**正确做法：**
```tsx
// ✅ 正确：使用 data prop
<DraggableItem
  id={task.id}
  type="task"
  source="task-pool"
  data={task}  // ✅ 正确的 prop 名称
>
  <TaskCard task={task} />
</DraggableItem>

// 在 renderDragOverlay 中访问
renderDragOverlay={(dragItem) => {
  // ✅ 添加防御性检查
  if (!dragItem.payload) {
    return <div>加载中...</div>;
  }
  return <div>{dragItem.payload.content}</div>;
}}
```

**防御性编程：**

即使正确使用了 `data` prop，也建议在 `renderDragOverlay` 中添加空值检查：

```tsx
const renderDragOverlay = (dragItem: DragItemData<TodoItemType>) => {
  // 防御性检查：确保 payload 存在
  if (!dragItem.payload) {
    return (
      <div className="bg-white/90 p-3 rounded-xl">
        <span className="text-sm text-slate-400">加载中...</span>
      </div>
    );
  }

  return (
    <div className="bg-white/90 p-3 rounded-xl">
      <span>{dragItem.payload.content}</span>
    </div>
  );
};
```

---

## 📖 详细使用指南

### DraggableItem 组件完整示例

```tsx
import { DraggableItem } from '@/other_project/dragDrop';
import type { TodoItem } from './types';

interface TaskCardProps {
  task: TodoItem;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <DraggableItem
      // 必需属性
      id={task.id}                    // 唯一标识，用于 dnd-kit 追踪
      data={task}                     // ⚠️ 注意：是 data 不是 payload
      
      // 可选属性
      type="task"                     // 拖拽项类型，用于过滤和识别
      source="task-pool"              // 来源区域，用于判断是否跨区域
      parentId={task.parentId}        // 父节点 ID（树形结构时使用）
      withChildren={false}            // 是否携带子节点
      disabled={task.isLocked}        // 是否禁用拖拽
      className="mb-2"                // 自定义类名
      draggingClassName="opacity-50"  // 拖拽时的类名
    >
      {/* 你的内容 */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3>{task.content}</h3>
        <p>{task.description}</p>
      </div>
    </DraggableItem>
  );
}
```

### CrossAreaDndProvider 完整示例

```tsx
import {
  CrossAreaDndProvider,
  DraggableItem,
  DroppableDateCell,
  DroppablePoolRoot,
  type DragItemData,
  type DropAreaData,
} from '@/other_project/dragDrop';
import type { TodoItem } from './types';

function TaskManagementApp() {
  const [poolTasks, setPoolTasks] = useState<TodoItem[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<Map<string, TodoItem[]>>(new Map());

  // 跨区域拖拽处理
  const handleCrossAreaDrop = (
    dragItem: DragItemData<TodoItem>,
    dropArea: DropAreaData<{ date?: string }>
  ) => {
    const task = dragItem.payload;
    
    if (dropArea.type === 'date-cell' && dropArea.payload?.date) {
      // 从任务池拖到日历
      console.log(`将任务 ${task.id} 安排到 ${dropArea.payload.date}`);
      
      // 更新状态
      setPoolTasks(prev => prev.filter(t => t.id !== task.id));
      setScheduledTasks(prev => {
        const newMap = new Map(prev);
        const dateTasks = newMap.get(dropArea.payload.date!) || [];
        newMap.set(dropArea.payload.date!, [...dateTasks, task]);
        return newMap;
      });
      
    } else if (dropArea.type === 'pool-root') {
      // 从日历拖回任务池
      console.log(`将任务 ${task.id} 移回任务池`);
      
      // 更新状态
      setScheduledTasks(prev => {
        const newMap = new Map(prev);
        for (const [date, tasks] of newMap.entries()) {
          newMap.set(date, tasks.filter(t => t.id !== task.id));
        }
        return newMap;
      });
      setPoolTasks(prev => [...prev, task]);
    }
  };

  // 自定义拖拽预览
  const renderDragOverlay = (dragItem: DragItemData<TodoItem>) => {
    if (!dragItem.payload) {
      return <div className="p-3 bg-white rounded-lg">加载中...</div>;
    }

    return (
      <div className="p-3 bg-white/90 backdrop-blur rounded-lg shadow-xl rotate-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-medium">{dragItem.payload.content}</span>
        </div>
      </div>
    );
  };

  return (
    <CrossAreaDndProvider
      onCrossAreaDrop={handleCrossAreaDrop}
      renderDragOverlay={renderDragOverlay}
      activationDistance={5}  // 拖拽激活距离（像素）
      enableKeyboard={true}   // 启用键盘控制
    >
      <div className="flex gap-8">
        {/* 任务池 */}
        <DroppablePoolRoot className="flex-1">
          <h2>任务池</h2>
          {poolTasks.map(task => (
            <DraggableItem
              key={task.id}
              id={task.id}
              type="task"
              source="task-pool"
              data={task}  // ⚠️ 使用 data 而不是 payload
            >
              <TaskCard task={task} />
            </DraggableItem>
          ))}
        </DroppablePoolRoot>

        {/* 日历 */}
        <div className="flex-1">
          <h2>日历</h2>
          <div className="grid grid-cols-7 gap-2">
            {dates.map(date => (
              <DroppableDateCell
                key={date}
                date={date}
                className="min-h-[100px] p-2 border rounded"
              >
                <div className="text-sm font-bold">{date}</div>
                {scheduledTasks.get(date)?.map(task => (
                  <div key={task.id} className="mt-1 p-1 bg-blue-100 rounded text-xs">
                    {task.content}
                  </div>
                ))}
              </DroppableDateCell>
            ))}
          </div>
        </div>
      </div>
    </CrossAreaDndProvider>
  );
}
```

### 最佳实践

#### 1. 类型安全

```tsx
import type { DragItemData, DropAreaData } from '@/other_project/dragDrop';

// 定义明确的类型
type TaskDragData = DragItemData<TodoItem>;
type DateDropData = DropAreaData<{ date: string }>;

const handleDrop = (dragItem: TaskDragData, dropArea: DateDropData) => {
  // TypeScript 会提供完整的类型提示
  const task = dragItem.payload;  // TodoItem
  const date = dropArea.payload?.date;  // string | undefined
};
```

#### 2. 数据验证

```tsx
const handleCrossAreaDrop = (dragItem, dropArea) => {
  // 验证 payload 存在
  if (!dragItem.payload) {
    console.error('拖拽项缺少 payload 数据');
    return;
  }

  // 验证类型匹配
  if (dropArea.accepts && !dropArea.accepts.includes(dragItem.type)) {
    console.warn(`放置区域不接受类型 ${dragItem.type}`);
    return;
  }

  // 执行业务逻辑
  // ...
};
```

#### 3. 性能优化

```tsx
// 使用 useMemo 缓存拖拽预览
const renderDragOverlay = useMemo(
  () => (dragItem: DragItemData<TodoItem>) => {
    if (!dragItem.payload) return null;
    return <TaskPreview task={dragItem.payload} />;
  },
  []
);

// 使用 useCallback 缓存回调
const handleCrossAreaDrop = useCallback(
  (dragItem, dropArea) => {
    // 处理逻辑
  },
  [/* 依赖项 */]
);
```

#### 4. 错误处理

```tsx
const handleCrossAreaDrop = async (dragItem, dropArea) => {
  try {
    // 验证数据
    if (!dragItem.payload) {
      throw new Error('拖拽项数据缺失');
    }

    // 执行异步操作
    await scheduleTask(dragItem.payload.id, dropArea.payload.date);
    
    // 更新 UI
    updateTaskList();
    
  } catch (error) {
    console.error('拖拽操作失败:', error);
    // 显示错误提示
    showErrorToast('操作失败，请重试');
    // 回滚状态
    revertChanges();
  }
};
```

---

## 🐛 调试技巧

### 1. 检查拖拽数据

```tsx
const handleCrossAreaDrop = (dragItem, dropArea, event) => {
  console.log('=== 拖拽调试信息 ===');
  console.log('拖拽项:', {
    id: dragItem.id,
    type: dragItem.type,
    source: dragItem.source,
    payload: dragItem.payload,
    hasPayload: !!dragItem.payload,
  });
  console.log('放置区域:', {
    id: dropArea.id,
    type: dropArea.type,
    payload: dropArea.payload,
    accepts: dropArea.accepts,
  });
  console.log('原始事件:', event);
};
```

### 2. 使用 onDragStart 验证数据

```tsx
<CrossAreaDndProvider
  onDragStart={(event) => {
    console.log('开始拖拽:', event.dragItem);
    if (!event.dragItem.payload) {
      console.error('⚠️ 警告：拖拽项缺少 payload 数据！');
      console.error('请检查 DraggableItem 是否使用了 data prop');
    }
  }}
  onCrossAreaDrop={handleCrossAreaDrop}
>
  {/* ... */}
</CrossAreaDndProvider>
```

### 3. React DevTools 检查

在 React DevTools 中检查 `DraggableItem` 组件的 props：
- 确认 `data` prop 有值
- 确认没有错误地使用 `payload` prop

---

## 📝 快速检查清单

使用 `DraggableItem` 时，请确保：

- [ ] 使用 `data={...}` 而不是 `payload={...}`
- [ ] 在 `renderDragOverlay` 中添加了 `payload` 的空值检查
- [ ] 设置了正确的 `type` 和 `source` 属性
- [ ] `id` 是唯一的
- [ ] 如果使用 TypeScript，正确定义了泛型类型
- [ ] 在 `onCrossAreaDrop` 中验证了数据的有效性
