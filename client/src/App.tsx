import { useState, useEffect } from 'react'

interface Task {
  id: number
  title: string
  done: boolean
  deadline: string | null
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => {
    fetch('http://localhost:3001/api/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
  }, [])

  const [newTitle, setNewTitle] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [newDeadline, setNewDeadline] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'default' | 'date' | 'title'>('default')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }

  const addTask = async () => {
    if (!newTitle.trim()) return
    const response = await fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, deadline: newDeadline || null }),
    })
    const newTask = await response.json()
    setTasks([...tasks, newTask])
    setNewTitle('')
    setNewDeadline('')
    showToast('Задача добавлена')
  }

  const deleteTask = async (id: number) => {
    await fetch('http://localhost:3001/api/tasks/' + id, {
      method: 'DELETE',
    })
    setTasks(tasks.filter((task) => task.id !== id))
    setDeleteConfirmId(null)
    showToast('Задача удалена')
  }

  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    await fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done }),
    })
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  const saveEdit = async () => {
    if (!editingId || !editingTitle.trim()) return

    await fetch(`http://localhost:3001/api/tasks/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editingTitle }),
    })
    setTasks(
      tasks.map((t) => (t.id === editingId ? { ...t, title: editingTitle } : t))
    )
    setEditingId(null)
    setEditingTitle('')
    showToast('Задача изменена')
  }
  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const clearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.done)

    for (const task of completedTasks) {
      await fetch(`http://localhost:3001/api/tasks/${task.id}`, {
        method: 'DELETE',
      })
    }
    setTasks(tasks.filter((t) => !t.done))
    showToast('Выполненные задачи удалены')
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active' && task.done) return false
    if (filter === 'completed' && !task.done) return false

    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title)
    }
    if (sortBy === 'date') {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    return 0
  })

  //-Счетчик задач
  const activeCount = tasks.filter((t) => !t.done).length
  const completedCount = tasks.filter((t) => t.done).length
  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  return (
    <div
      className={`p-8 max-w-xl ml-2 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Мои задачи:</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-1 py-1 rounded cursor-pointer bg-gray-900 dark:bg-gray-900"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="flex gap-4 mb-10">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Нoвая задача..."
          className={`flex-1 p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          className={`flex-1 p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-500 text-white rounded ml-2 cursor-pointer"
        >
          Добавить
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded cursor-pointer ${filter === 'all' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded cursor-pointer ${filter === 'active' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          Активные
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded cursor-pointer ${filter === 'completed' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          Выполненные
        </button>
      </div>

      {/* Поиск */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Поиск задач.."
        className={`flex-1 w-full p-2 mb-4 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
      />

      {/* Сортировка */}
      <div className="flex gap-2 mb-4">
        <span className="text-gray-500">Сортировка:</span>
        <button
          onClick={() => setSortBy('default')}
          className={`px-2 py-1 rounded text-sm cursor-pointer ${sortBy === 'default' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          По умолчанию
        </button>
        <button
          onClick={() => setSortBy('date')}
          className={`px-2 py-1 rounded text-sm cursor-pointer ${sortBy === 'date' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          По дате
        </button>
        <button
          onClick={() => setSortBy('title')}
          className={`px-2 py-1 rounded text-sm cursor-pointer ${sortBy === 'title' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          По названию
        </button>
      </div>

      {/* Счетчик  */}
      <p className="text-gray-500 mb-4">
        Осталось: {activeCount} | Выполнено: {completedCount} | Всего:{' '}
        {tasks.length}
      </p>

      {completedCount > 0 && (
        <button
          onClick={clearCompleted}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 cursor-pointer"
        >
          Очистить выполненное ({completedCount})
        </button>
      )}

      {/* Список */}
      <ul className="space-y-4">
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            className={`p-3 rounded flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
          >
            {editingId === task.id ? (
              //- Режим редактирования
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className={`flex-1 p-1 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
                />
                <button
                  onClick={saveEdit}
                  className="text-green-500 hover:text-green-700 cursor-pointer"
                >
                  Сохранить
                </button>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Отмена
                </button>
              </div>
            ) : (
              //- Обычный режим
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className={`ml-2 cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
                  />
                  <span
                    className={`break-words max-w-[210px] ${task.done ? 'line-through text-gray-400' : ''}`}
                  >
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {task.deadline && (
                    <span
                      className={`text-sm ${isOverdue(task.deadline) && !task.done ? 'text-red-500 font-bold' : 'text-gray-500'}`}
                    >
                      📅 {task.deadline}
                    </span>
                  )}
                  <button
                    onClick={() => startEdit(task)}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(task.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Удалить
                  </button>
                </div>
              </>
            )}
          </li>
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
    </div>
  )
}

export default App
