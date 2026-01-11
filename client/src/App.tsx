import { useState, useEffect } from 'react'

interface Task {
  id: number
  title: string
  done: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => {
    fetch('http://localhost:3001/api/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
  }, [])

  const [newTitle, setNewTitle] = useState('')

  const addTask = async () => {
    if (!newTitle.trim()) return
    const response = await fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    })
    const newTask = await response.json()

    setTasks([...tasks, newTask])
    setNewTitle('')
  }

  const deleteTask = async (id: number) => {
    await fetch('http://localhost:3001/api/tasks/' + id, {
      method: 'DELETE',
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id ===id)
    if (!task) return

    await fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done })
    })

    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    )
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
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
        >
          Добавить
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-3 bg-gray-100 rounded flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="ml-2 mr-2"
              />
              <span className={task.done ? 'line-through text-gray-400' : ''}>
                {task.title}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 mr-4 hover:text-red-700"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
