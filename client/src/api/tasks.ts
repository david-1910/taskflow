import { request } from './client'

export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  done: boolean
  deadline: string | null
  priority: Priority
  category: string | null
}

export type NewTask = Omit<Task, 'id' | 'done'>
export type TaskPatch = Partial<Omit<Task, 'id'>>

export const tasksApi = {
  getAll: (): Promise<Task[]> => request<Task[]>('/tasks'),

  create: (data: NewTask): Promise<Task> =>
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
      fallbackError: 'Ошибка создания задачи',
    }),

  update: (id: number, data: TaskPatch): Promise<void> =>
    request<void>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      fallbackError: 'Ошибка обновления задачи',
    }),

  delete: (id: number): Promise<void> =>
    request<void>(`/tasks/${id}`, {
      method: 'DELETE',
      fallbackError: 'Ошибка удаления задачи',
    }),
}
