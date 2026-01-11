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
  const addTask = () => {
    if (!newTitle.trim()) return

    const newTask: Task = {
      id: Date.now(),
      title: newTitle,
      done: false,
    }
    setTasks([...tasks, newTask])
    setNewTitle('')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Мои задачи</h1>
      <div className="flex gap mb-4">
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
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-3 bg-gray-100 rounded">
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
