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

export type StatusFilter = 'all' | 'active' | 'completed'
export type SortBy = 'default' | 'date' | 'title' | 'priority'
