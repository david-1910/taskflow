import { useState, useEffect } from 'react'
import { type Task, tasksApi } from './api/tasks'
import { TaskItem } from './components/TaskItem'
import { TaskForm } from './components/TaskForm'
import { Filters } from './components/Filters'
import { priorityColor } from './utils/styles'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    tasksApi.getAll()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const [newTitle, setNewTitle] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [newDeadline, setNewDeadline] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'default' | 'date' | 'title' | 'priority'>('default')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newCategory, setNewCategory] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }

  const addTask = async () => {
    if (!newTitle.trim()) return
    try {
      const newTask = await tasksApi.create({
        title: newTitle,
        deadline: newDeadline || null,
        priority: newPriority,
        category: newCategory || null,
      })
      setTasks([...tasks, newTask])
      setNewTitle('')
      setNewDeadline('')
      setNewPriority('medium')
      setNewCategory('')
      showToast('Задача добавлена')
    } catch {
      showToast('Ошибка при добавлении')
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await tasksApi.delete(id)
      setTasks(tasks.filter((task) => task.id !== id))
      setDeleteConfirmId(null)
      showToast('Задача удалена')
    } catch {
      showToast('Ошибка при удалении')
    }
  }

  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    try {
      await tasksApi.update(id, { done: !task.done })
      setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
    } catch {
      showToast('Ошибка при обновлении')
    }
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  const saveEdit = async () => {
    if (!editingId || !editingTitle.trim()) return
    try {
      await tasksApi.update(editingId, { title: editingTitle })
      setTasks(tasks.map((t) => (t.id === editingId ? { ...t, title: editingTitle } : t)))
      setEditingId(null)
      setEditingTitle('')
      showToast('Задача изменена')
    } catch {
      showToast('Ошибка при сохранении')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const clearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.done)
    try {
      for (const task of completedTasks) {
        await tasksApi.delete(task.id)
      }
      setTasks(tasks.filter((t) => !t.done))
      showToast('Выполненные задачи удалены')
    } catch {
      showToast('Ошибка при удалении')
    }
  }

  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))] as string[]

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active' && task.done) return false
    if (filter === 'completed' && !task.done) return false
    if (filterCategory && task.category !== filterCategory) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'date') {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority]
    return 0
  })

  const activeCount = tasks.filter((t) => !t.done).length
  const completedCount = tasks.filter((t) => t.done).length

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id)
    const img = new Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    e.dataTransfer.setDragImage(img, 0, 0)
    setDragPosition({ x: e.clientX, y: e.clientY })
  }

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX !== 0 && e.clientY !== 0) {
      setDragPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetId: number) => {
    if (draggedId === null || draggedId === targetId) return
    const draggedIndex = tasks.findIndex((t) => t.id === draggedId)
    const targetIndex = tasks.findIndex((t) => t.id === targetId)
    const newTasks = [...tasks]
    const [draggedTask] = newTasks.splice(draggedIndex, 1)
    newTasks.splice(targetIndex, 0, draggedTask)
    setTasks(newTasks)
    setDraggedId(null)
    setSortBy('default')
  }

  if (loading) {
    return <div className="p-8">Загрузка...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">Ошибка: {error}</div>
  }

  return (
    <div className={`p-8 max-w-xl ml-2 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Мои задачи:</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-1 py-1 rounded cursor-pointer bg-gray-900 dark:bg-gray-900"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <TaskForm
        darkMode={darkMode}
        newTitle={newTitle}
        newDeadline={newDeadline}
        newPriority={newPriority}
        newCategory={newCategory}
        onTitleChange={setNewTitle}
        onDeadlineChange={setNewDeadline}
        onPriorityChange={setNewPriority}
        onCategoryChange={setNewCategory}
        onSubmit={addTask}
      />

      <Filters
        darkMode={darkMode}
        filter={filter}
        sortBy={sortBy}
        searchQuery={searchQuery}
        filterCategory={filterCategory}
        categories={categories}
        onFilterChange={setFilter}
        onSortChange={setSortBy}
        onSearchChange={setSearchQuery}
        onCategoryChange={setFilterCategory}
      />

      <p className="text-gray-500 mb-4">
        Осталось: {activeCount} | Выполнено: {completedCount} | Всего: {tasks.length}
      </p>

      {completedCount > 0 && (
        <button
          onClick={clearCompleted}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 cursor-pointer"
        >
          Очистить выполненное ({completedCount})
        </button>
      )}

      <ul className="space-y-4">
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            darkMode={darkMode}
            isEditing={editingId === task.id}
            editingTitle={editingTitle}
            isDragging={draggedId === task.id}
            onToggle={() => toggleTask(task.id)}
            onDelete={() => setDeleteConfirmId(task.id)}
            onStartEdit={() => startEdit(task)}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onEditingTitleChange={setEditingTitle}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDrag={handleDrag}
            onDragEnd={() => setDraggedId(null)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(task.id)}
            isOverdue={isOverdue(task.deadline)}
          />
        ))}
      </ul>

      {/* Модальное окно подтверждения */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className={`p-6 rounded shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="mb-4">Удалить эту задачу?</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className={`px-4 py-2 rounded cursor-pointer ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                Отмена
              </button>
              <button
                onClick={() => deleteTask(deleteConfirmId)}
                className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast уведомление */}
      {toast && (
        <div className="fixed top-4 left-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg toast-animation">
          {toast}
        </div>
      )}

      {/* Превью при перетаскивании */}
      {draggedId && (() => {
        const task = tasks.find((t) => t.id === draggedId)
        if (!task) return null
        return (
          <div
            className={`fixed pointer-events-none p-3 rounded shadow-2xl z-50 flex justify-between items-center gap-4 border-2 border-blue-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
            style={{
              left: dragPosition.x + 10,
              top: dragPosition.y - 20,
              minWidth: 300,
              opacity: 0.95,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400">⠿</span>
              <input type="checkbox" checked={task.done} readOnly className="cursor-pointer" />
              <span className={`w-2 h-2 rounded-full ${priorityColor(task.priority)}`} />
              <span className={task.done ? 'line-through text-gray-400' : ''}>
                {task.title}
              </span>
              {task.category && (
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                  {task.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              {task.deadline && <span className="text-gray-500">{task.deadline}</span>}
              <span className="text-blue-500">Изменить</span>
              <span className="text-red-500">Удалить</span>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

export default App
