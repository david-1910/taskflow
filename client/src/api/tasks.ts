const API_URL = 'http://localhost:3001/api/tasks'

export interface Task {
  id: number
  title: string
  done: boolean
  deadline: string | null
  priority: 'low' | 'medium' | 'high'
  category: string | null
}

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Ошибка загрузки задач')
    return response.json()
  },

  create: async (data: {
    title: string
    deadline: string | null
    priority: 'low' | 'medium' | 'high'
    category: string | null
  }): Promise<Task> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Ошибка создания задачи')
    return response.json()
  },

  update: async (id: number, data: Partial<Task>): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Ошибка обновления задачи')
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Ошибка удаления задачи')
  },
}
