import type { Request } from 'express'

export type Priority = 'low' | 'medium' | 'high'

/** Row shape of the `users` table */
export interface UserRow {
  id: number
  username: string
  password: string
}

/** Row shape of the `tasks` table (SQLite stores booleans as integers) */
export interface TaskRow {
  id: number
  title: string
  done: number
  deadline: string | null
  priority: Priority
  category: string | null
  user_id: number
}

/** Task as exposed through the API (`done` normalized to boolean) */
export interface TaskDto {
  id: number
  title: string
  done: boolean
  deadline: string | null
  priority: Priority
  category: string | null
}

/** Express request augmented by the auth middleware */
export interface AuthenticatedRequest extends Request {
  userId?: number
}
