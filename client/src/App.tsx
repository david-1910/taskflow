import { useEffect, useState } from 'react'
import type { NewTask, SortBy, StatusFilter, Task } from './types'
import { tasksApi } from './api/tasks'
import { tokenStorage, usernameStorage } from './api/auth'
import { TaskItem } from './components/TaskItem'
import { TaskForm } from './components/TaskForm'
import { Filters } from './components/Filters'
import { AuthForm } from './components/AuthForm'
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal'
import { TaskViewModal } from './components/TaskViewModal'
import { appBackgroundClass, cardClass, priorityColor } from './utils/styles'
import { FiLogOut, FiSun, FiMoon, FiCheckCircle, FiUser } from 'react-icons/fi'

const PRIORITY_ORDER: Record<Task['priority'], number> = {
  high: 0,
  medium: 1,
  low: 2,
}

const isOverdue = (deadline: string | null) =>
  deadline !== null && new Date(deadline) < new Date()

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!tokenStorage.get())
  const [username, setUsername] = useState(usernameStorage.get() || '')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('default')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [viewingTask, setViewingTask] = useState<Task | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    setLoading(true)
    tasksApi
      .getAll()
      .then(setTasks)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setUsername(usernameStorage.get() || '')
  }

  const handleLogout = () => {
    tokenStorage.remove()
    usernameStorage.remove()
    setIsAuthenticated(false)
    setUsername('')
    setTasks([])
  }

  const addTask = async (draft: NewTask) => {
    try {
      const newTask = await tasksApi.create(draft)
      setTasks((prev) => [...prev, newTask])
      showToast('Задача добавлена')
    } catch {
      showToast('Ошибка при добавлении')
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await tasksApi.delete(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
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
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      )
    } catch {
      showToast('Ошибка при обновлении')
    }
  }

  const startEdit = (task: Task) => {
    setViewingTask(null)
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  const saveEdit = async () => {
    if (!editingId || !editingTitle.trim()) return
    try {
      await tasksApi.update(editingId, { title: editingTitle })
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...t, title: editingTitle } : t
        )
      )
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
      await Promise.all(completedTasks.map((task) => tasksApi.delete(task.id)))
      setTasks((prev) => prev.filter((t) => !t.done))
      showToast('Выполненные задачи удалены')
    } catch {
      showToast('Ошибка при удалении')
    }
  }

  const categories = [
    ...new Set(tasks.map((t) => t.category).filter(Boolean)),
  ] as string[]

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active' && task.done) return false
    if (filter === 'completed' && !task.done) return false
    if (filterCategory && task.category !== filterCategory) return false
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'date': {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      case 'priority':
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      default:
        return 0
    }
  })

  const activeCount = tasks.filter((t) => !t.done).length
  const completedCount = tasks.filter((t) => t.done).length

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id)
    const img = new Image()
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
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

  if (!isAuthenticated) {
    return <AuthForm onSuccess={handleAuthSuccess} />
  }

  if (loading) {
    return (
      <div className={`${appBackgroundClass(false)} flex items-center justify-center`}>
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${appBackgroundClass(false)} flex items-center justify-center`}>
        <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl text-white">
          Ошибка: {error}
        </div>
      </div>
    )
  }

  const draggedTask =
    draggedId !== null ? tasks.find((t) => t.id === draggedId) : undefined

  return (
    <div className={appBackgroundClass(darkMode)}>
      <div className="max-w-2xl mx-auto p-6">
        {/* Шапка */}
        <header className={`${cardClass(darkMode)} p-6 mb-6`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-slate-600' : 'bg-white/30'
                }`}
              >
                <FiCheckCircle className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
                <div className="flex items-center gap-1 text-white/70 text-sm">
                  <FiUser className="text-sm" />
                  <span>{username}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {darkMode ? (
                  <FiSun className="text-yellow-400 text-xl" />
                ) : (
                  <FiMoon className="text-white text-xl" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-red-600/20 hover:bg-red-600/30'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <FiLogOut className="text-red-400 text-xl" />
              </button>
            </div>
          </div>
        </header>

        {/* Форма добавления */}
        <div className={`${cardClass(darkMode)} p-6 mb-6`}>
          <TaskForm darkMode={darkMode} onSubmit={addTask} />
        </div>

        {/* Фильтры */}
        <div className={`${cardClass(darkMode)} p-6 mb-6`}>
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
        </div>

        {/* Статистика */}
        <div className={`${cardClass(darkMode)} p-4 mb-6`}>
          <div className="flex justify-between items-center text-white">
            <div className="flex gap-6">
              {[
                { value: activeCount, label: 'Активных' },
                { value: completedCount, label: 'Выполнено' },
                { value: tasks.length, label: 'Всего' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-sm text-white/70 hover:text-white cursor-pointer transition-colors"
              >
                Очистить выполненные
              </button>
            )}
          </div>
        </div>

        {/* Список задач */}
        <ul className="space-y-3">
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
              onView={() => setViewingTask(task)}
            />
          ))}
        </ul>

        {sortedTasks.length === 0 && (
          <div className={`${cardClass(darkMode)} p-12 text-center`}>
            <div className="text-6xl mb-4">📝</div>
            <p className="text-white/70">Нет задач</p>
          </div>
        )}

        {/* Модальное окно подтверждения удаления */}
        {deleteConfirmId !== null && (
          <ConfirmDeleteModal
            darkMode={darkMode}
            onConfirm={() => deleteTask(deleteConfirmId)}
            onCancel={() => setDeleteConfirmId(null)}
          />
        )}

        {/* Модальное окно просмотра задачи */}
        {viewingTask && (
          <TaskViewModal
            task={viewingTask}
            darkMode={darkMode}
            isOverdue={isOverdue}
            onEdit={startEdit}
            onClose={() => setViewingTask(null)}
          />
        )}

        {/* Toast уведомление */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 toast-animation">
            {toast}
          </div>
        )}

        {/* Превью при перетаскивании */}
        {draggedTask && (
          <div
            className={`fixed pointer-events-none p-4 rounded-xl shadow-2xl z-50 border-2 border-slate-400 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
            style={{
              left: dragPosition.x + 10,
              top: dragPosition.y - 20,
              minWidth: 280,
              opacity: 0.95,
            }}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={draggedTask.done}
                readOnly
                className="w-5 h-5"
              />
              <span
                className={`w-3 h-3 rounded-full ${priorityColor(draggedTask.priority)}`}
              />
              <span className={draggedTask.done ? 'line-through opacity-50' : ''}>
                {draggedTask.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
