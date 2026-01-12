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
  }

  const deleteTask = async (id: number) => {
    await fetch('http://localhost:3001/api/tasks/' + id, {
      method: 'DELETE',
    })
    setTasks(tasks.filter((task) => task.id !== id))
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
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.done
    if (filter === 'completed') return task.done
    return true
  })

  //-Счетчик задач
  const activeCount = tasks.filter((t) => !t.done).length
  const completedCount = tasks.filter((t) => t.done).length
  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  return (
    <div className="p-8 max-w-xl ml-2">
      <h1 className="text-2xl font-bold mb-4">Мои задачи:</h1>
      <div className="flex gap-4 mb-10">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Нoвая задача..."
          className="flex-1 p-2 border rounded"
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          className="p-2 border rounded"
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
          className={`px-3 py-1 rounded cursor-pointer ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded cursor-pointer ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Активные
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded cursor-pointer ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Выполненные
        </button>
      </div>

      {/* Счетчик  */}
      <p className="text-gray-500 mb-4">
        Осталось: {activeCount} | Выполнено: {completedCount} | Всего:{' '}
        {tasks.length}
      </p>

      {completedCount > 0 && (
        <button onClick={clearCompleted} className="text-sm text-gray-500 hover:text-gray-700 mb-4 cursor-pointer">
          Очистить выполненное ({completedCount})
        </button>
      )}

      {/* Список */}
      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="p-3 bg-gray-100 rounded flex justify-between items-center"
          >
            {editingId === task.id ? (
              //- Режим редактирования
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1 p-1 border rounded"
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
                    className="ml-2 cursor-pointer"
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
                    onClick={() => deleteTask(task.id)}
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
    </div>
  )
}

export default App
