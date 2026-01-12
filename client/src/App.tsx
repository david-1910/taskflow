import { useState, useEffect } from 'react'
import { type Task, tasksApi } from './api/tasks'
import { TaskItem } from './components/TaskItem'
import { TaskForm } from './components/TaskForm'
import { Filters } from './components/Filters'
import { AuthForm } from './components/AuthForm'
import { tokenStorage, usernameStorage } from './api/auth'
import { priorityColor } from './utils/styles'
import { FiLogOut, FiSun, FiMoon, FiCheckCircle, FiUser } from 'react-icons/fi'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!tokenStorage.get())
  const [username, setUsername] = useState(usernameStorage.get() || '')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
  const [viewingTask, setViewingTask] = useState<Task | null>(null)

  const loadTasks = () => {
    setLoading(true)
    tasksApi.getAll()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

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

  if (!isAuthenticated) {
    return <AuthForm onSuccess={handleAuthSuccess} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600">
        <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl text-white">
          Ошибка: {error}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600'}`}>
      <div className="max-w-2xl mx-auto p-6">
        {/* Шапка */}
        <header className={`backdrop-blur-lg rounded-2xl p-6 mb-6 border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/20 border-white/30'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-slate-600' : 'bg-white/30'}`}>
                <FiCheckCircle className={`text-2xl ${darkMode ? 'text-white' : 'text-white'}`} />
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
                className={`p-3 rounded-xl transition-all cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/20 hover:bg-white/30'}`}
              >
                {darkMode ? <FiSun className="text-yellow-400 text-xl" /> : <FiMoon className="text-white text-xl" />}
              </button>
              <button
                onClick={handleLogout}
                className={`p-3 rounded-xl transition-all cursor-pointer ${darkMode ? 'bg-red-600/20 hover:bg-red-600/30' : 'bg-white/20 hover:bg-white/30'}`}
              >
                <FiLogOut className="text-red-400 text-xl" />
              </button>
            </div>
          </div>
        </header>

        {/* Форма добавления */}
        <div className={`backdrop-blur-lg rounded-2xl p-6 mb-6 border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/20 border-white/30'}`}>
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
        </div>

        {/* Фильтры */}
        <div className={`backdrop-blur-lg rounded-2xl p-6 mb-6 border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/20 border-white/30'}`}>
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
        <div className={`backdrop-blur-lg rounded-2xl p-4 mb-6 border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/20 border-white/30'}`}>
          <div className="flex justify-between items-center text-white">
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{activeCount}</div>
                <div className="text-xs text-white/70">Активных</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-xs text-white/70">Выполнено</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{tasks.length}</div>
                <div className="text-xs text-white/70">Всего</div>
              </div>
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
          <div className={`backdrop-blur-lg rounded-2xl p-12 text-center border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/20 border-white/30'}`}>
            <div className="text-6xl mb-4">📝</div>
            <p className="text-white/70">Нет задач</p>
          </div>
        )}

        {/* Модальное окно подтверждения */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Удалить задачу?
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Это действие нельзя отменить
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className={`flex-1 px-4 py-2 rounded-xl cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                >
                  Отмена
                </button>
                <button
                  onClick={() => deleteTask(deleteConfirmId)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl cursor-pointer transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно просмотра задачи */}
        {viewingTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full ${priorityColor(viewingTask.priority)}`} />
                  <span className={`text-sm px-2 py-1 rounded ${
                    viewingTask.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : viewingTask.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {viewingTask.priority === 'high' ? 'Высокий' : viewingTask.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                  {viewingTask.done && (
                    <span className="text-sm px-2 py-1 rounded bg-slate-100 text-slate-700">
                      Выполнено
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setViewingTask(null)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  ✕
                </button>
              </div>

              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} ${viewingTask.done ? 'line-through opacity-50' : ''}`}>
                {viewingTask.title}
              </h3>

              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {viewingTask.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Категория:</span>
                    <span className={`px-2 py-1 text-sm rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {viewingTask.category}
                    </span>
                  </div>
                )}

                {viewingTask.deadline && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Дедлайн:</span>
                    <span className={`px-2 py-1 text-sm rounded ${
                      isOverdue(viewingTask.deadline) && !viewingTask.done
                        ? 'bg-red-100 text-red-700'
                        : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      {viewingTask.deadline}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setViewingTask(null)
                    startEdit(viewingTask)
                  }}
                  className={`flex-1 px-4 py-2 rounded-xl cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                >
                  Редактировать
                </button>
                <button
                  onClick={() => setViewingTask(null)}
                  className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl cursor-pointer transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast уведомление */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 toast-animation">
            {toast}
          </div>
        )}

        {/* Превью при перетаскивании */}
        {draggedId && (() => {
          const task = tasks.find((t) => t.id === draggedId)
          if (!task) return null
          return (
            <div
              className={`fixed pointer-events-none p-4 rounded-xl shadow-2xl z-50 border-2 border-slate-400 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              style={{
                left: dragPosition.x + 10,
                top: dragPosition.y - 20,
                minWidth: 280,
                opacity: 0.95,
              }}
            >
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={task.done} readOnly className="w-5 h-5" />
                <span className={`w-3 h-3 rounded-full ${priorityColor(task.priority)}`} />
                <span className={task.done ? 'line-through opacity-50' : ''}>
                  {task.title}
                </span>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default App
